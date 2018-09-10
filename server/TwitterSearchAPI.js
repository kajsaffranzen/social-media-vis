const https = require('https');
const p = require('es6-promise');
const cleanTwitterData = require('./cleanTwitterData');
const TwitterCredentials = require('./OAuth.js');
const oauth = new TwitterCredentials();

const self = module.exports = {
  getRecentData(lat, lng) {
    return new p.Promise(function(resolve) {
      const oauth2 = oauth.getCredentials();
      oauth2.getOAuthAccessToken('', {
        'grant_type': 'client_credentials'
      }, function (e, access_token) {
        const options = {
          hostname: 'api.twitter.com',
          path: '/1.1/search/tweets.json?q=&geocode='+lat+','+lng+',10km&result_type=recent&count=4',
          headers: {
            Authorization: 'Bearer ' + access_token
          }
        };
        https.get(options, function (result) {
          let buffer = '';
          result.setEncoding('utf8');
          result.on('data', function (data) {
              buffer += data;
          });
          result.on('end', function () {
            const tweets = JSON.parse(buffer);
            const promise = cleanTwitterData.newCleanData(tweets);

            promise.then(function(response) {
              console.log('cleaned and returned data');
              resolve(response);
            })
          });
        });
      })
    })
  },
  buildNextIterationUrl(maxId) {
    console.log('i buildNext ', maxId);
    return new p.Promise(function(resolve) {
      const oauth2 = oauth.getCredentials();
       oauth2.getOAuthAccessToken('', {
         'grant_type': 'client_credentials'
       }, function (e, access_token) {
         const options = {
           hostname: 'api.twitter.com',
           path: '/1.1/search/tweets.json?max_id='+maxId+'&q=&geocode=59.32932349999999%2C18.068580800000063%2C10km&count=4',
           headers: {
             Authorization: 'Bearer ' + access_token
           }
         };
          resolve(self.getData(options));
       });    
    });
  },
  getData(options) {
    return new p.Promise(function(resolve) {
      https.get(options, function (result) {
        let buffer = '';
        result.setEncoding('utf8');
        result.on('data', function (data) {
          buffer += data;
        });
        result.on('end', function () {
          const tweets = JSON.parse(buffer);
          const promise = cleanTwitterData.newCleanData(tweets);
          promise.then(function (response) {
            console.log('cleaned and returned data');
            resolve(response);
          });
        })
      })
    });
  }
};