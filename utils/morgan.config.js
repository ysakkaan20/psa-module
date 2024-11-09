'use strict';

const morgan = require('morgan'),
    debug = console.log
let config = {
    ignoreURLs: [],
    ignoreStaticFiles: true,
    showDateTime: true,
    env: 'development',
    userKey: 'UserName'
}

Object.byString = function(o, s) {
    try{
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        let a = s.split('.');
        for (let i = 0, n = a.length; i < n; ++i) {
            let k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return;
            }
        }
        return o;
    }catch (e) {
        return ''
    }
}

morgan.token('realclfdate', function (req, res) {
    const clfmonth = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const pad2 = function (num) {
        const str = String(num);

        return (str.length === 1 ? '0' : '')
            + str;
    };
    const dateTime = new Date();
    const date = dateTime.getDate();
    const hour = dateTime.getHours();
    const mins = dateTime.getMinutes();
    const secs = dateTime.getSeconds();
    const year = dateTime.getFullYear();
    let timezoneofset = dateTime.getTimezoneOffset();
    const sign = timezoneofset > 0 ? '-' : '+';
    timezoneofset = parseInt(Math.abs(timezoneofset) / 60);
    const month = clfmonth[dateTime.getUTCMonth()];

    return pad2(date) + '/' + month + '/' + year
        + ' ' + pad2(hour) + ':' + pad2(mins) + ':' + pad2(secs) + ' ' + sign + pad2(timezoneofset) + '00';
});

morgan.token('ip', function (req, res) {
    return req.header('x-forwarded-for') || req.ip;
});
morgan.token('userName', function (req, res) {
    return Object.byString(req, config.userKey);
});

module.exports = function (options) {

    config.ignoreStaticFiles = (typeof options.ignoreStaticFiles === 'boolean') ? options.ignoreStaticFiles : config.ignoreStaticFiles;

    config.env = (typeof options.env === 'string') ? options.env : config.env;
    config.userKey = (typeof options.env === 'string') ? options.userKey : config.userKey;

    debug(config)

    if (typeof options.ignoreURLs === 'object') {
        if (Array.isArray(options.ignoreURLs)) {
            config.ignoreURLs = options.ignoreURLs;
        } else {
            throw new Error('option ignoreURLs must be array')
        }
    }

    return morgan((config.env === "production" ?
        ':ip ' +
        '[:realclfdate] ' +
        ':status ' +
        ':method ' +
        ':url ' +
        ':response-time ms ' +
        '":user-agent" ":referrer" ' +
        'C_L[:req[content-length] > :res[content-length]] ' +
        'U[:userName]' :
        'dev'), {
        skip: function (req, res) {

            for (let url of config.ignoreURLs) {
                // console.log(url + '---', req.originalUrl.startsWith(url))
                return req.originalUrl.startsWith(url) || res.statusCode === 304
            }
        }
    })
}
