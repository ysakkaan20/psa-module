# PSA Apps Configurations

This module provide default configurations for PSA apps 
import and use


## Install
```sh
npm install -S git+ssh://git@bitbucket.org/police-science-academy/psa-module.git
```

## Test
```sh
npm test
```

## Load
```js
// load modules
    const psaModule = require('psa-module')
```

## Configure Morgan

Minimal example, just setup two locales and a project specific directory

```js
//middleware express
    app.use(psaModule.morgan({
        ignoreURLs: [],
        ignoreStaticFiles: true,
        showDateTime: true,
    }));
```
## Middlware 

Detect if request from local network

```js
const { localNetworkDetect } = require('psa-module').v2.middlwares;
//middleware express
    app.use(localNetworkDetect);
```

## Configure Passport Strategy

Minimal example, just setup two locales and a project specific directory

#### .env
```dotenv
    SERVER_URL=https://auth.psa.ac.ae/
    CLIENT_ID=xxx
    CLIENT_SECRET=xxx
```
#### appConfig.js
```js
    AUTH: {
            SERVER_URL: process.env.SERVER_URL,
            CLIENT_ID: process.env.CLIENT_ID,
            CLIENT_SECRET: process.env.CLIENT_SECRET,
        }
```
#### app.js
```js
    app.use(strategy({
        authServerURL: appConfig.AUTH.SERVER_URL,
        hostURL: appConfig.HOST_URL,
        clientID: appConfig.AUTH.CLIENT_ID,
        clientSecret: appConfig.AUTH.CLIENT_SECRET,
        sessionKey: 'UserName', //default username
        failureRedirect: '/users/login?error=1' //default /error
    }))
```
#### URL
```
/oauth2/init
/oauth2/callback
```
#Flash
```js
    app.use(psaModule.flash());
```
## Logging & Debugging

Logging any kind of output is moved to [debug](https://github.com/visionmedia/debug) module. To let psaM output anything run your app with `DEBUG` env set like so:

```sh
$ DEBUG=psam:* node app.js
```

psaM exposes three log-levels:

* psam:debug
* psam:warn
* psam:error

if you only want to get errors and warnings reported start your node server like so:

```sh
$ DEBUG=psaM:warn,psaM:error node app.js
```

Combine those settings with you existing application if any of you other modules or libs also uses __debug__



## Changelog


* 0.0.2: Strategy module added
* 0.0.1: start

