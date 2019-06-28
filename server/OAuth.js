const OAuth = require('oauth');
const env = require('node-env-file');
const p = require('es6-promise');

module.exports = class TwitterCredentials {
  loadKeys(){
    env(__dirname + '/.env');
    this.twitter_consumer_key = process.env.TWITTER_CONSUMER_KEY;
    this.twitter_consumer_secret = process.env.TWITTER_CONSUMUER_SECRET;
  }

  getCredentials() {
    const OAuth2 = OAuth.OAuth2;
    this.loadKeys();
    return new OAuth2(
      this.twitter_consumer_key,
      this.twitter_consumer_secret,
      'https://api.twitter.com/',
      null,
      'oauth2/token',
      null
    );
  }

  getAccessToken() {
    const oauth2 = this.getCredentials();

    return new p.Promise(function(resolve) {
      oauth2.getOAuthAccessToken('', {
          'grant_type': 'client_credentials'
      }, function (e, access_token) {
          resolve(access_token);
      });
    });
  }
};
