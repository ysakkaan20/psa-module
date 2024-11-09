'use strict'

const redis = require('redis')
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const cookieParser = require('cookie-parser');
const debug = console.log

module.exports = function (options) {
    const appConfig = require('../src/config')
    let redisClient = redis.createClient({
        host: appConfig.REDIS.HOST,
        port: appConfig.REDIS.PORT,
        db: appConfig.REDIS.DB_SESSION
    })


    let config = {
        debug: false,
        saveUninitialized: true,
        resave: true,
        env: 'development',
        name: 'psa.id',
        secret: '',
        maxAge: 30 * 24 * 60,
        prefix: ''

    }

    function configValidate({options, config: c,}) {

    }

    config.debug = (typeof options.debug === 'boolean') ? options.debug : config.debug;
    config.saveUninitialized = (typeof options.saveUninitialized === 'boolean') ? options.saveUninitialized : config.saveUninitialized;
    config.resave = (typeof options.resave === 'boolean') ? options.resave : config.resave;

    config.name = (typeof options.name === 'string') ? options.name : config.name;
    config.secret = (typeof options.secret === 'string') ? options.secret : config.secret;
    config.maxAge = (typeof options.maxAge === 'number') ? options.maxAge : config.maxAge;
    config.prefix = (typeof options.prefix === 'string') ? options.prefix : config.prefix;

    debug(config)

    return [
        cookieParser(),
        session({
            name: config.name,
            resave: false,
            saveUninitialized: false, // don't create session until something stored
            secret: config.secret,
            cookie: {maxAge: config.maxAge}, // Default 1 Day , On Remember me 7 Days
            store: new redisStore({prefix: config.prefix, client: redisClient}),
            expires: true
        })
    ]
}
