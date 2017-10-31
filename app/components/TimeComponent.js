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
var x2;
var y2;
var focus, context;
var xAxis;
var yAxis;
var t;
var line, line2, area2;
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

    init2() {
        this.margin = {top: 20, right: 0, bottom: 20, left: 5};
        this.width = document.getElementById('line-chart').clientWidth;
        this.height = document.getElementById('line-chart').clientHeight;

        this.svg = d3.select('#line-chart').append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            //.attr('transform', 'translate('+this.margin.left + ',' +this.margin.top+')')
            .append("g")
                .attr("transform","translate(" + this.margin.left + "," +this.margin.top + ")");

        // set the ranges
        x = d3.scaleTime().rangeRound([0,this.width-this.margin.right-this.margin.left]);
        y = d3.scaleLinear().range([this.height*0.5, 0]);

        this.height2 = 100;
        this.width2 = document.getElementById('line-chart').clientWidth - this.margin.left - this.margin.right;
        x2 = d3.scaleTime().rangeRound([0, this.width-this.margin.right*2])
        y2 = d3.scaleLinear().range([this.height2, 0]);

        this.brush = d3.brushX()
            .extent([[0, 0], [this.width, this.height2]])
            .on("end", brushed);

        //append tooltip
        //this.div = d3.select('#line-chart').append('div').attr('class', 'tooltip')

        var formatPercent  = d3.format('.0%')
        xAxis = d3.axisBottom(x).ticks(7);
        yAxis = d3.axisLeft(y); //.ticks(10); //.ticks(5); //.tickFormat(formatPercent);
        //var yAxis = d3.axisLeft(y).ticks(5).tickFormat(formatPercent);

        line = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.value); })

        //define second line
        line2 = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.value); })

        area2 = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function(d) { return x2(d.date); })
            .y0(100)
            .y1(function(d) { return y2(d.value); });

        //TODO: linjen hoppar utanför när man brushar. Borde lösas med .attr("clip-path", "url(#clip)") men funakr ej :()
        focus = this.svg
                .attr('class', 'focus')
                //.attr("clip-path", "url(#clip)")
                .attr("transform", "translate(" + 5 + "," + this.margin.top + ")")
                //.append('g')

        context = this.svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + 0 + "," + this.height*0.6 + ")");

        context.append("g")
            .attr("class", "brush")
            .call(this.brush)
            .call(this.brush.move, x.range());

          function brushed() {
            var s = d3.event.selection || x2.range();
            x.domain(s.map(x2.invert, x2));
            focus.select(".axis--x").call(xAxis);
            focus.select(".line").attr("d", line);
          }
    }
    drawContext(data, geo_data){
        this.svg.selectAll('.axis--xx').remove();
        this.svg.selectAll('.area').remove();
        this.xAxis2 = d3.axisBottom(x2).ticks(7);
        x2.domain(d3.extent(data, function(d) { return d.date; }));
        y2.domain(d3.extent(data, function(d) { return d.value; }));

      context.append("g")
            .attr("class", "axis axis--xx")
            .attr("transform", "translate(0," + this.height2 + ")")
            .call(this.xAxis2);

        context.append("path")
              .datum(data)
              .attr("class", "area")
              .attr("d", area2);
    }

    testDraw(data, data2){
        console.log(data);
        console.log(data2);
        //this.svg.selectAll('path').remove();
        this.svg.selectAll('.line').remove();
        this.svg.selectAll('.axis-y').remove();
        this.svg.selectAll('.axis--x').remove();
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.value; })]);

        xAxis = d3.axisBottom(x).ticks(7);

        //draw the line
        focus.append('path')
            .attr("clip-path", "url(#clip)")
            .datum(data)
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("class", "line")
            .attr("d", line)

        this.svg.append('path')
            .attr("clip-path", "url(#clip)")
            .datum(data2)
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("class", "line")
            .attr("d", line2)
            .style('stroke', 'red')

        //draw the x-axis
        focus.append("g")
              .attr("class", "axis axis--x")
              .attr("transform", "translate(0," + this.height *0.5+ ")")
              .call(xAxis);

         // text label for the x axis
          focus.append("text")
              .attr("transform",
                    "translate(" + (this.width/2) + " ," +
                                   (this.height *0.5 +35)+ ")")
              .style("text-anchor", "middle")
              .text("Date");

      focus.append("g")
                .attr('class', 'axis-y')
                .call(yAxis);

            // text label for the y axis
          focus.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 0 - this.margin.left)
              .attr("x",0 - (this.height / 4))
              .attr("dy", "1em")
              .style("text-anchor", "middle")
              .text("Number of Tweets");
    }
    getTwitterData(topic, coords){
        let promise = new p.Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/twitter/content/'+topic+'/'+coords[0]+'/'+coords[1],
            }).then((res) => {
                this.filterData(res)
            })
        })
    }
    /* update the headline with current topic and place */
    updateGraphTopic(topic, place){
        let city = place.split(',');
        document.getElementById("line-chart-topic").innerHTML = topic.toUpperCase();
        document.getElementById("line-chart-area").innerHTML = city[0].toUpperCase();
    }
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

        //this.drawContext(new_data, new_geoData)
        //this.testDraw(new_data, new_geoData);
        this.drawGraph(transformed_data, new_geoData, new_noneGeo);

        /*var filteredData = _.groupBy(data, d => {
            var m = moment(new Date(d.created_at));
            var the_moment = m.format('YYYY-MM-DD');
            //kod som funkar och rundar till närmaste timme
            /*var the_moment = 0;
            if(m.minute() < 30) the_moment = m.startOf('hour');
            else the_moment = m.add(1, 'hour').startOf('hour');*/
            //var t = new Date(d.date)
            /*return the_moment;
        })

        geoTaggedData = _.groupBy(geoTaggedData, d => {
            var m = moment(new Date(d.created_at));
            var the_moment = m.format('YYYY-MM-DD');
            return the_moment;
        })

        let newObj = [];
        for(let value in filteredData){
            let val = filteredData[value].length;
            let obj = {
                'date': new Date(value),
                'value': val,
            }
            newObj.push(obj);
        }*/


    }
}

export default TimeComponent;
