/*
    Creates a  simple line graphs based on a chosen topic
    The topic comes from either the bar graph or from the tex
*/

var d3 = require('d3');
import p from 'es6-promise';
import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';

var x;
var y;
var focusM
var xAxis;
var yAxis;
var t;
var line;
class TimeComponent {
    constructor(){
        this.data_test = 0;
        t = this;
        this.init();
    }
    init(){
        this.margin = {top: 20, right: 10, bottom: 20, left: 30};
        this.width = document.getElementById('line-chart').clientWidth;
        this.height = document.getElementById('line-chart').clientHeight;
        this.graph_size = this.width - this.margin.left*3.2;

        this.svg = d3.select('#line-chart').append('svg')
            .attr('width', this.width-this.margin.left-this.margin.right)
            .attr('height', this.height)
            .append("g")
                .attr("transform","translate(" + this.margin.left + "," +this.margin.top + ")");

        // set the ranges
        x = d3.scaleTime().rangeRound([0, this.graph_size]);
        y = d3.scaleLinear().range([this.height*0.5, 0]);

        var formatPercent  = d3.format('.0%')
        xAxis = d3.axisBottom(x).ticks(7);

        line = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.value); })

        focus = this.svg;
    }
    /*
        draw line in the graph
        all = contains both geo and none goe
        geo = contains only goe tagged data
        none_geo = contains only none geo tagged data
    */
    drawGraph(all, geo, none_geo) {
        console.log('all: ', all.length);
        console.log('geo: ', geo.length);
        console.log('none_geo: ', none_geo.length);

        this.svg.selectAll('.line').remove();
        this.svg.selectAll('.axis-y').remove();
        this.svg.selectAll('.axis--x').remove();

        var x_margin = this.margin.left-10;

        /* define and draw x-axis */
        x.domain(d3.extent(all, function(d) { return d.date; }));
        xAxis = d3.axisBottom(x).ticks(7);

        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate("+x_margin+"," + this.height *0.5+ ")")
            .call(xAxis);

          focus.append("text")
              .attr("transform",
                    "translate(" + (this.width/2) + " ," +
                                   (this.height *0.5 +35)+ ")")
              .style("text-anchor", "middle")
              .text("Date");

        /* define and draw y-axis */
        y.domain([0, d3.max(all, function(d) { return d.value; })]);
        yAxis = d3.axisLeft(y);
        focus.append("g")
            .attr('class', 'axis-y')
            .attr("transform", "translate("+x_margin+",0)")
            .call(yAxis);

        focus.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - this.margin.left)
            .attr("x",0 - (this.height / 4))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Number of Tweets");

        /* define and draw line */
        focus.append('path')
            .attr("transform", "translate("+x_margin+",0)")
            .datum(all)
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("class", "line")
            .attr("d", line)
    }

    transformData(data){
        //group data by hour
        var filteredData = _.groupBy(data, d => {
            var m = moment(new Date(d.created_at));
            var the_moment = m.format('YYYY-MM-DD');
            return the_moment;
        });

        //create new objects
        let newObj = [];
        for(let value in filteredData){
            let val = filteredData[value].length;
            let obj = {
                'date': new Date(value),
                'value': val,
            }
            newObj.push(obj);
        }
        return newObj;
    }

    /* update the headline with current topic and place */
    updateGraphTopic(topic, place){
        let city = place.split(',');
        document.getElementById("line-chart-topic").innerHTML = topic.toUpperCase();
        document.getElementById("line-chart-area").innerHTML = city[0].toUpperCase();
    }

    /* process data to right structure */
    filterData(data){
        console.log('i filterData ' + data.length);
        var geoTaggedData = [];
        var noneGeoData = [];

        //fillter data points that is geotagged
        for(let value of data){
            if(value.coords)
                geoTaggedData.push(value);
            else noneGeoData.push(value);
        }

        var transformed_data = this.transformData(data);
        var new_geoData = this.transformData(geoTaggedData);
        var new_noneGeo = this.transformData(noneGeoData);

        this.drawGraph(transformed_data, new_geoData, new_noneGeo);
    }
}

export default TimeComponent;
