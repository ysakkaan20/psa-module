const ActiveDirectory = require('activedirectory');
const AD2 = require('./activeDirectory2');

const config = require('../config');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ApplicationError,
} = require('./error');

module.exports = {
  validateUser: async (username) => {
    const ad = new ActiveDirectory({
      url: config.DOMAIN.URL,
      baseDN: config.DOMAIN.BASE_DN,
      username: config.DOMAIN.USERNAME,
      password: config.DOMAIN.PASSWORD,
    });
    if (!username) throw new BadRequestError('Username is required');

    return new Promise((resolve, reject) => {
      ad.findUser(username,
        async (e, users) => {
          if (e) {
            return reject(new BadRequestError(e));
          }
          if ((!users) || (users.length === 0)) return reject(new BadRequestError('Invalid username'));

          resolve(users);
        });
    });
  },
  authenticateUser: async (username, password) => {
    const ad = new ActiveDirectory({
      url: config.DOMAIN.URL,
      baseDN: config.DOMAIN.BASE_DN,
      username: config.DOMAIN.USERNAME,
      password: config.DOMAIN.PASSWORD,
    });
    if (!username) throw new BadRequestError('Username is required');
    if (!password) throw new BadRequestError('Password is required');

    return new Promise((resolve, reject) => {
      ad.authenticate(
        username + config.DOMAIN.USER_PREFIX,
        password,
        async (e, auth) => {
          if (e || !auth) {
            return reject(new BadRequestError('Invalid username or password'));
          }
          resolve(true);
        },
      );
    });
  },
  findOne: AD2.findUser,
  findAll: async ({ ignoreComputers = true } = { ignoreComputers: true }) => {
    const newUser = [];
    const users = await AD2.findAll();
    for (const usr of users) {
      if (ignoreComputers) {
        if (usr.objectClass.indexOf('computer') === -1 && usr.dn.indexOf('InActive User') === -1) {
          newUser.push({
            ...usr,
            active: true,
          });
        }
      } else {
        newUser.push({
          ...usr,
          active: !(usr.dn.indexOf('InActive User') > -1),
        });
      }
    }
    return newUser;
  },
  findAllOld: async () => {
    // eslint-disable-next-line new-cap
    const ad = new ActiveDirectory({
      url: config.DOMAIN.URL,
      baseDN: config.DOMAIN.BASE_DN,
      username: config.DOMAIN.USERNAME,
      password: config.DOMAIN.PASSWORD,
    });

    return new Promise((resolve, reject) => {
      /** paged required ldap@0.7.1 version */
      ad.findUsers({ filter: '(mail=*psa*)', paged: true }, async (err, users) => {
        if (err) {
          return reject(new BadRequestError(err.message));
        }

        if (!users) {
          return resolve([]);
        }
        for (const usr of users) {
          usr.active = !(usr.dn.indexOf('InActive User') > -1);
        }
        return resolve(users);
      });
    });
  },
};
