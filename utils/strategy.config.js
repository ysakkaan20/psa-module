/**
 * Module dependencies.
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const util = require('util');
const passport = require('passport');
const base64url = require('base64url');
const { OAuth2Strategy } = require('passport-oauth');
const { InternalOAuthError } = require('passport-oauth');
const logger = require('../src/modules/logger');
const config = require('../src/config');

const { debug } = logger;
const opts = {};

const parse = function (profile) {
  return profile;
};

function psaStrategy(options = {}) {
  if (!options.authServerURL) {
    if (config.AUTH.SERVER_URL) options.authServerURL = config.AUTH.SERVER_URL;
    else throw new TypeError('OAuth2Strategy requires a authServerURL option');
  }
  if (!options.hostURL) {
    throw new TypeError('OAuth2Strategy requires a hostURL option');
  }
  if (!options.clientID) {
    throw new TypeError('OAuth2Strategy requires a clientID option');
  }
  if (!options.clientSecret) {
    throw new TypeError('OAuth2Strategy requires a clientSecret option');
  }

  opts.authServerURL = options.authServerURL;
  opts.authServerProfileURI = options.authServerProfileURI || 'user';
  opts.baseURL = options.baseURL || '';
  opts.hostURL = options.hostURL + (opts.baseURL ? `${options.baseURL}/` : '');
  opts.sessionKey = options.sessionKey;
  opts.clientID = options.clientID;
  opts.clientSecret = options.clientSecret;
  opts.failureRedirect = options.failureRedirect || '/error';
  opts.debug = options.debug || false;
  opts.successCallback = options.successCallback;

  opts.oauth2 = {
    authorizationURL: `${opts.authServerURL}oauth2/authorize`,
    tokenURL: `${opts.authServerURL}oauth2/token`,
    clientID: opts.clientID,
    clientSecret: opts.clientSecret,
    callbackURL: `${opts.hostURL}oauth2/callback`,
  };

  /**
   * `Strategy` constructor.
   *
   * The example-oauth2orize authentication strategy authenticates requests by delegating to
   * example-oauth2orize using the OAuth 2.0 protocol.
   *
   * Applications must supply a `verify` callback which accepts an `accessToken`,
   * `refreshToken` and service-specific `profile`, and then calls the `done`
   * callback supplying a `user`, which should be set to `false` if the
   * credentials are not valid.  If an exception occured, `err` should be set.
   *
   * Options:
   *   - `clientID`      your example-oauth2orize application's client id
   *   - `clientSecret`  your example-oauth2orize application's client secret
   *   - `callbackURL`   URL to which example-oauth2orize will redirect the user after granting authorization
   *
   * Examples:
   *
   *     passport.use(new ExampleStrategy({
   *         clientID: '123-456-789',
   *         clientSecret: 'shhh-its-a-secret'
   *         callbackURL: 'https://www.example.net/auth/example-oauth2orize/callback'
   *       },
   *       function (accessToken, refreshToken, profile, done) {
   *         User.findOrCreate(..., function (err, user) {
   *           done(err, user);
   *         });
   *       }
   *     ));
   *
   * @param {Object} options
   * @param {Function} verify
   * @api public
   */
  // eslint-disable-next-line no-shadow
  function Strategy(options, verify) {
    const me = this;

    options = options || {};
    options.authorizationURL = options.authorizationURL
      || options.authorizationUrl
      || (opts.oauth2.authorizationURL);
    options.tokenURL = options.tokenURL
      || options.tokenUrl
      || (opts.oauth2.tokenURL);

    OAuth2Strategy.call(me, options, verify);

    // must be called after prototype is modified
    me.name = 'PSA-AUTH-STRATEGY';
  }

  /**
   * Inherit from `OAuth2Strategy`.
   */
  util.inherits(Strategy, OAuth2Strategy);

  /**
   * Retrieve user profile from example-oauth2orize.
   *
   * This function constructs a normalized profile, with the following properties:
   *
   *   - `provider`         always set to `example-oauth2orize`
   *   - `id`
   *   - `username`
   *   - `displayName`
   *
   * @param {String} accessToken
   * @param {Function} done
   * @api protected
   */

  Strategy.prototype.userProfile = function (accessToken, done) {
    const me = this;

    me._oauth2.get(
      opts.authServerURL + opts.authServerProfileURI,
      accessToken,
      (err, body /* , res */) => {
        if (opts.debug) debug('body', body);
        let json; let
          profile;
        if (err) {
          return done(new InternalOAuthError('failed to fetch user profile', err));
        }

        if (typeof body === 'string') {
          try {
            json = JSON.parse(body);
          } catch (e) {
            done(e);
            return;
          }
        } else if (typeof body === 'object') {
          json = body;
        }
        // eslint-disable-next-line prefer-const
        profile = parse(json);
        profile.provider = me.name;
        if (opts.debug) debug('PROFILE', profile);
        // profile._raw = body;
        // profile._json = json;

        done(null, profile);
      },
    );
  };

  passport.use('PSA-AUTH-STRATEGY',
    new Strategy(opts.oauth2,
      ((accessToken, refreshToken, profile, done) => {
        done(null, profile);
      })));

  const middleware = [
    passport.initialize(),
    function (req, res, next) {
      if (req.url.indexOf(`${opts.baseURL ? `/${opts.baseURL}` : ''}/oauth2/init`) === 0) {
        const state = req.query.state ? `&state=${base64url(req.query.state)}` : '';
        return res.redirect(`${opts.oauth2.authorizationURL}?response_type=code&client_id=${opts.clientID}&redirect_uri=${opts.oauth2.callbackURL}${state}`);
      }
      return next();
    },
    function (req, res, next) {
      if (req.url.indexOf(`${opts.baseURL ? `/${opts.baseURL}` : ''}/oauth2/callback`) === 0) {
        return passport.authenticate('PSA-AUTH-STRATEGY', {
          session: false,
          failureRedirect: opts.failureRedirect,
        })(req, res, next);
      }
      return next();
    },
    function (req, res, next) {
      if (req.url.indexOf(`${opts.baseURL ? `/${opts.baseURL}` : ''}/oauth2/callback`) === 0) {
        if (opts.successCallback) {
          opts.successCallback(req, res, next);
        } else {
          req.session[opts.sessionKey] = req.user.username;
          let successRedirect = '/';
          if (req.query.state) successRedirect = base64url.decode(req.query.state);
          return res.redirect(successRedirect);
        }
      } else next();
    },
  ];

  return middleware;
}

/**
 * Expose `passport`.
 */
module.exports = psaStrategy;
