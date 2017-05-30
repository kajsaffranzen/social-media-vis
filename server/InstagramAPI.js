var OAuth = require('oauth');
var https = require('https');
var app = require('express');
var instagram = require('instagram-node').instagram();
//http://localhost:3000/#access_token=205067545.b63db5a.a21c2806c5ae4473a8384071dd48425c

var YOUR_CLIENT_ID = 'b63db5a6f1084a69b2da5c3c110a1155',
    YOUR_CLIENT_SECRET = '2f87019ed52e428b8145bf0233957e35';

instagram.use({ access_token: '205067545.b63db5a.a21c2806c5ae4473a8384071dd48425c'});

//https://api.instagram.com/v1/locations/251069728/media/recent?access_token=205067545.b63db5a.a21c2806c5ae4473a8384071dd48425c
//https://api.instagram.com/v1/media/search?lat=59.32932349999999&lng=18.068580800000063&access_token=205067545.b63db5a.a21c2806c5ae4473a8384071dd48425c
//https://api.instagram.com/v1/media/search?lat=48.858844&lng=2.294351&access_token=205067545.b63db5a.a21c2806c5ae4473a8384071dd48425c


/*instagram.use({
    client_id: YOUR_CLIENT_ID,
    client_secret: YOUR_CLIENT_SECRET
});*/
var options =
instagram.location_search(
    { lat: 59.32932349999999, lng: 18.068580800000063 },
    [10,] ,
    function(err, result, remaining, limit) {
    if(err)
        console.log(err);
    //console.log(result);
});

//ig.location_media_recent('786341101', [options,] function(err, result, pagination, remaining, limit) {});
instagram.location_media('213277', function(err, result, pagination, remaining, limit) {
    if(err)
        console.log(err);
    //console.log(result);
});
