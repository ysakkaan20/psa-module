const activeDirectory2 = require('ldapjs');
const config = require('../config');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ApplicationError,
} = require('./error');

const options = {
  url: config.DOMAIN.URL,
  base: config.DOMAIN.BASE_DN,
  username: config.DOMAIN.USERNAME,
  password: config.DOMAIN.PASSWORD,
};

let client = null;
if (options.url) {
  client = activeDirectory2.createClient({
    url: options.url,
  });
}

const findUser = (username) => new Promise((resolve, reject) => {
  if (!client) {
    return reject(new ApplicationError('LDAP: Client not initialized'));
  }
  client.bind(options.username, options.password, (error) => {
    if (error) {
      client.destroy(error);
      console.error(error);
      return reject(new BadRequestError('LDAP: Wrong username or password'));
    }
    const opts = {
      // attributes: ['psa', 'local']
      scope: 'sub',
      filter: `(&(objectClass=user)(CN=${username}*))`,
    };

    client.search(options.base, opts, (err, res) => {
      if (err) {
        client.unbind();
        reject(err);
      }
      // res.on('searchRequest', (searchRequest) => {
      //     console.log('searchRequest: ', searchRequest.messageID);
      // });
      res.on('searchEntry', (entry) => {
        // console.log('entry: ' + JSON.stringify(entry.object)); //.object
        if (entry.object.sAMAccountName === username) {
          client.unbind();
          resolve(entry.object);
        }
      });
      // res.on('searchReference', (referral) => {
      //     console.log('referral: ' + referral.uris.join());
      // });
      res.on('error', (er) => {
        // console.error('error: ' + err.message);
        client.unbind();
        reject(er);
      });
      res.on('end', (result) => {
        // console.log('status: ' + result.status);
        client.unbind();
        reject(new NotFoundError('User not found'));
      });
    });
  });
});

const findAll = () => new Promise((resolve, reject) => {
  if (!client) {
    return reject(new ApplicationError('LDAP: Client not initialized'));
  }
  const matchedUsers = [];
  client.bind(options.username, options.password, (error) => {
    if (error) {
      client.destroy(error);
      console.error(error);
      return reject(new BadRequestError('LDAP: Wrong username or password'));
    }
    const opts = {
      attributes: ['lastLogonTimestamp', 'objectCategory', 'userPrincipalName', 'sAMAccountName', 'mail', 'telephoneNumber', 'logonCount',
        'accountExpires', 'pwdLastSet', 'lastLogon', 'name', 'co', 'memberOf', 'displayName', 'whenCreated',
        'whenChanged', 'givenName', 'postOfficeBox', 'description', 'title', 'c', 'sn', 'cn', 'objectClass', 'dn'],
      scope: 'sub',
      filter: '(&(objectClass=user)(CN=*))',
    };

    client.search(options.base, opts, (err, res) => {
      if (err) {
        client.unbind();
        reject(err);
      }
      res.on('searchEntry', (entry) => {
        matchedUsers.push(entry.object);
      });
      res.on('error', (er) => {
        client.unbind();
        reject(er);
      });
      res.on('end', () => {
        client.unbind();
        resolve(matchedUsers);
      });
    });
  });
});
module.exports = {
  findUser,
  findAll,
};
