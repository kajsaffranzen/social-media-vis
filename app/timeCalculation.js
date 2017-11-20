//få in data från Mapbox.js
import Moment from 'moment'
import { extendMoment } from 'moment-range';
import tz from 'moment-timezone'
const moment = extendMoment(Moment);
import $ from 'jquery';

//tilldela varje data point en ny variabel som är indexet för vilken färg cirkel ska ha

class timeCalculation{
    constructor(d3){
        this.nrOfIntervals = 3;
        this.intervals = [];
        this.svg = d3;
        this.height = document.getElementById('map').clientHeight;
        this.width = document.getElementById('map').clientWidth;
        this.drawCircles();
        this.init();
    }
    init() {
        let $checkBox = $('#real-time-box');
        $checkBox .on("click", () => {
            let isChecked = $checkBox.is(':checked')
            if(isChecked) {
                this.svg.selectAll('.timeinterval-txt').remove();
                this.svg.selectAll('.time-dot').remove();
            };
        })
    }
    createInterval(start, end){
        //skapa de olika tids-intervallen, alltså hur många olika färger det ska finnas
        let end_date = new Date(end);
        end_date = end_date.getTime();

        let start_date = new Date(start);
        start_date = start_date.getTime();

        let diff = end_date - start_date;
        let del = diff/this.nrOfIntervals+1;

        for(var i = 0; i < (this.nrOfIntervals+1); i++){
            var time = moment(new Date(start_date+(del*i))).format()
            this.intervals.push(time)
        }

        console.log(this.intervals);
        this.drawTimeinterval();
    }
    assignInterval(data){
        //loop throug the data set and assign an index to each point that
        //represent which interval it belongs to
        for(let value of data) {
            let time = moment(value.created_at).format();
            if(value.created_at >= this.intervals[0] &&value.created_at < this.intervals[1])
                value.index = 0;
            else if(value.created_at >= this.intervals[1] && value.created_at < this.intervals[2])
                value.index = 1;
            else if(value.created_at >= this.intervals[2] && value.created_at <= this.intervals[3])
                value.index = 2;
            else value.index = 4;
        }

        return data;
    }

    assignIntervalToObject(value){
            if(value.created_at > this.intervals[0] &&value.created_at < this.intervals[1])
                value.index = 0;
            else if(value.created_at > this.intervals[1] &&value.created_at < this.intervals[2])
                value.index = 1;
            else if(value.created_at > this.intervals[2] &&value.created_at < this.intervals[3])
                value.index = 2;
            else value.index = 4;

        return value;
    }

    /* checks if a single object is within the selected interval or not*/
    withinInterval(value){
        var time = moment(value.time);
        time = time.tz('Europe/Stockholm').format('YYYY-MM-DD hh:mm');
        if(time >= this.intervals[0] && time <= this.intervals[3]) {
            return true;
        } else return false;
    }

    /* draw labels */
    drawTimeinterval() {
        this.svg.selectAll('.timeinterval-txt').remove();

        let data = [
            " > " + moment(this.intervals[0]).format('YYYY-MM-DD hh:mm'),
            moment(this.intervals[1]).format('YYYY-MM-DD hh:mm') +  " < " + moment(this.intervals[2]).format('YYYY-MM-DD hh:mm'),
             " < "+ moment(this.intervals[3]).format('YYYY-MM-DD hh:mm')
        ]
        console.log(data);

        var text = this.svg.selectAll('timeinterval-txt')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'timeinterval-txt')
            .attr('x', this.width-240)
            .attr('y', (d, i) => { return this.height- (25 + (i*20)) })
            .style('text-anchor', 'left')
            .text((d) => { return d});
    }

    drawCircles() {
        var data = [0, 1, 2];
        let timeColors = ['#8C1104', '#008C43', '#003F1E']
        var circle = this.svg.selectAll('circle')
            .data(timeColors)
            .enter()
            .append("circle")
            .attr('class', 'time-dot')
            .attr("r", 8)
            .attr("cx", this.width-260)
            .attr('cy', (d, i) => { return this.height- (30 + (i*20)) })
            .attr("fill", (d, i) => {
                return timeColors[i];
            })
            .style('stroke', 'black')
    }

} export default timeCalculation;
