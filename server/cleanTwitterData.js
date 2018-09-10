var fs = require('fs');
var p = require('es6-promise');
var moment = require('moment');
var tz = require('moment-timezone');


var self = module.exports = {
  createObject(){
    var t = '[{"lng": "0", "lat": "0", "count": "0"}]';

    var obj = JSON.parse(t);
    return obj;
  },
  saveToFile(obj){
      //fs.writeFile('test.json', obj, 'utf8', callback);
    fs.writeFile("test1.json", obj, function(err) {
      console.error(err);
  });
  },
  cleanData(data){
    console.log('i cleaned ', data.length)
      var jsonObj = [];
      return new p.Promise(function(resolve){
        console.log('i promise')
          for(var i = 0; i < data.length; i++){
            console
              for(var j = 0; j <data[i].length; j++){
                console.log(data[i])
                  var lat = 0;
                  var lng = 0;
                  if(data[i][j].coordinates != null){
                      lat = data[i][j].coordinates.coordinates[1];
                      lng = data[i][j].coordinates.coordinates[0];
                  }
                 var newObject = {
                     lat: lat,
                     lng: lng,
                      id: data[i][j].id_str,
                      time: data[i][j].created_at,
                      text: data[i][j].text,
                      retweet_count: data[i][j].retweet_count,
                      name: data[i][j].user.name
                 };
                 jsonObj.push(newObject);
              }
          }
          /*var json = JSON.stringify(jsonObj);
          self.saveToFile(json);*/
          //console.log(jsonObj);
          resolve(jsonObj);
      });
  },
  newCleanData(tweets) {
    let cleanedData = [];
    let max_id = undefined;
    const data = tweets.statuses;

    return new p.Promise(function(resolve) {
      for (let i = 0; i < data.length; i++) {
        const time = moment(data[i].created_at);
        const tweet = {
            "coords": data[i].coordinates,
            "geo": data[i].geo,
            "place": data[i].place,
            "id":data[i].id_str,
            "text" : data[i].text,
            "created_at": time.tz('Europe/Stockholm').format(),
            "retweet_count": data[i].retweet_count,
            "name": data[i].user.screen_name,
            "entities": data[i].entities
         };
        cleanedData.push(tweet);
      }

      if (tweets.search_metadata.next_results) {
        const nextResult = tweets.search_metadata.next_results.split('&q');
        max_id = nextResult[0].split('max_id=');
      }

      const finalData = {
        "data": cleanedData,
        "max_id": max_id[1]
      };

      resolve(finalData);
    })
  }
};
