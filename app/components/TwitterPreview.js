/*
Creates and shows a simple preview for tweets from the chosen area
The shown tweets are based on what kind of filter the user wants
*/

import _ from 'underscore';
var TwitterWidgetsLoader = require('twitter-widgets');

class TwitterPreview {
    constructor(){
        this.init();
    }
    init(){
        //create defaul filters
        let filterTypes = ['Most retweeted', 'Recent'];
        for(var i = 0; i < filterTypes.length; i++){
            var node = document.createElement('div');
            node.innerHTML = '<input type="checkbox" id="check' + i + '" name="check' + i + '"><label for="check' + i + '">'+ filterTypes[i]+'</label>';
            document.getElementsByClassName('tweet-preview')[0].appendChild(node);
        }

    }
    //Fill each box with data
    setData(data, index){
        //filter twitter depending on type e.g most retweeted, image, url,
        let filter = '';
        if(document.getElementById('check0').checked === false){
            for(var i = 1; i < 3; i++)
                document.getElementById('tweet_'+i).innerHTML = data[index][i].id;
        }
        else {
            if(document.getElementById('check0').checked === true)
                filter = 'retweets';

            var sortData = _.sortBy(data[index], filter);
            for(var i = 1; i < 3; i++)
                document.getElementById('tweet_'+i).innerHTML = sortData[sortData.length-i].retweets;

        }


    }
}

export default TwitterPreview;
