import p from 'es6-promise'
import $ from 'jquery'

import TimeComponent from './components/TimeComponent'

class TopicRequest {
    constructor(){
        this.topic = null;
        this.query = null;
        this.data = null;
        this.time = new TimeComponent();
    }
    getTwitterData(input, coords){
        console.log(' i getTwitterData');
        this.topic = input;
        let str = input.toString();
        if(str.toLowerCase().indexOf('#') >= 0){
            str = str.substring(1)
            this.query = '%23'+str.charAt(0).toUpperCase() + str.slice(1);
        } else this.query = str;

        console.log('this.quer ', this.query);
        this.getTwitterDataTrend(this.query, str, coords);
    }
    getTwitterDataTrend(query, name, coords){
        console.log('i getTwitterDataTrend');
        this.topic = name;

        let promise = new p.Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/twitter/content/'+query+'/'+coords[0]+'/'+coords[1],
            }).then((res) => {
                this.data = res;
                console.log(res);
                this.setInput();
                this.time.filterData(res);
            })
        })
    }
    setInput(){
        let t = this.topic.toString()
        document.getElementById('word-search-input').value = t;
    }
} export default TopicRequest;
