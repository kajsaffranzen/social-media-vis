import p from 'es6-promise'
import $ from 'jquery'

import TimeComponent from './components/TimeComponent'

class TopicRequest {
    constructor(mapbox){
        this.topic = null;
        this.query = null;
        this.data = null;
        this.map = mapbox;
        this.time = new TimeComponent();
    }
    getTwitterData(input, coords, place){
        console.log(' i getTwitterData');
        this.topic = input;
        let str = input.toString();
        if(str.toLowerCase().indexOf('#') >= 0){
            str = str.substring(1)
            this.query = '%23'+str.charAt(0).toUpperCase() + str.slice(1);
        } else this.query = str;

        console.log('this.quer ', this.query);
        this.getTwitterDataTrend(this.query, str, coords, place);
    }
    getTwitterDataTrend(query, name, coords, place){
        console.log('Fetching data for chosen topic: ' + name);
        this.topic = name;
        this.updateTopicArea(this.topic);
        this.loadingWidget(true);

        let promise = new p.Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/twitter/content/'+query+'/'+coords[0]+'/'+coords[1],
            }).then((res) => {
                this.data = res;
                console.log('fetched data:  '+res.length);
                this.time.updateGraphTopic(name, place);
                this.loadingWidget(false);

                //draw line graph
                this.time.filterData(res);

                //update topic input field
                this.map.updateTopic(name);

                this.map.addTopicData(res);
            })
        })
    }

    /* add/remove loading symbole */
    loadingWidget(show) {
      let widget = document.getElementsByClassName('loading-widget')[0]
      if (show) {
        widget.style.display = 'block'
      } else {
        widget.style.display = 'none'
      }
    }

    drawLineGraph(data) {
      this.time.filterData(data);
    }

    updateTopicArea(topic) {
        topic = topic.toString();
        document.getElementById('word-search-input').value = topic;
    }

} export default TopicRequest;
