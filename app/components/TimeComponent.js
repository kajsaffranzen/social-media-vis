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
var t;
var line, area2;
class TimeComponent {
    constructor(){
        this.data_test = 0;
        t = this;
        this.init();
    }
    init() {
        this.margin = {top: 20, right: 30, bottom: 20, left: 30};
        this.width = document.getElementById('line-chart').clientWidth - this.margin.left - this.margin.right;
        this.height = document.getElementById('line-chart').clientHeight;

        //- this.margin.bottom - this.margin.top;

        this.svg = d3.select('#line-chart').append('svg')
                                .attr('width', this.width)
                                .attr('height', this.height)
                                .attr('transform', 'translate('+this.margin.left + ',' +this.margin.top+')')
                                .append("g").attr("transform","translate(" + this.margin.left + "," +this.margin.top + ")");

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
        this.div = d3.select('#line-chart').append('div').attr('class', 'tooltip')

        /*let newObj = [{'date': 'Thu Jun 08 2017 02:00:00 GMT+0200 (CEST)', 'value': 0.3},
        {'date': 'Wed Jun 07 2017 02:00:00 GMT+0200 (CEST)', 'value': 0.27},
        {'date': 'Thu Jun 06 2017 02:00:00 GMT+0200 (CEST)', 'value': 0.9},
        {'date': 'Mon Jun 05 2017 02:00:00 GMT+0200 (CEST)', 'value': 0.5},
        {'date': 'Mon Jun 04 2017 02:00:00 GMT+0200 (CEST)', 'value': 0.3 },
        {'date': 'Mon Jun 03 2017 02:00:00 GMT+0200 (CEST)', 'value': 0.2 },
        {'date': 'Mon Jun 02 2017 02:00:00 GMT+0200 (CEST)', 'value': 0.8 }];
        for(let val of newObj){
            val.date = new Date(val.date);
        }*/

        var formatPercent  = d3.format('.0%')
        //x.domain(d3.extent(newObj, function(d) { return d.date; }));
        xAxis = d3.axisBottom(x).ticks(7);
        var yAxis = d3.axisLeft(y).ticks(5).tickFormat(formatPercent);


        line = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.value); })

    area2 = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function(d) { return x2(d.date); })
            .y0(100)
            .y1(function(d) { return y2(d.value); });

            //TODO: linjen hoppar utanför när man brushar. Borde lösas med .attr("clip-path", "url(#clip)") men funakr ej :()
        focus = this.svg.append('g')
                .attr('class', 'focus')
                .attr("clip-path", "url(#clip)")
                .attr("transform", "translate(" + 5 + "," + this.margin.top + ")")
                .append('g')

        context = this.svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + 0 + "," + this.height*0.6 + ")");

      focus.append("g").call(yAxis);

        //den andra
        /*x2.domain(x.domain());
        y2.domain(y.domain());*/

        context.append("g")
          .attr("class", "brush")
          .call(this.brush)
          .call(this.brush.move, x.range());


          function brushed(){
              var s = d3.event.selection || x2.range();
              x.domain(s.map(x2.invert, x2));
              focus.select(".axis--x").call(xAxis);
             focus.select(".line").attr("d", line);
          }
        /*this.drawContext(newObj)
        this.testDraw(newObj)*/
    }
    drawContext(data){
        this.svg.selectAll('.axis--xx').remove();
        this.svg.selectAll('.area').remove();
        this.xAxis2 = d3.axisBottom(x2).ticks(7);
        x2.domain(d3.extent(data, function(d) { return d.date; }));
        y2.domain(y.domain());

      context.append("g")
            .attr("class", "axis axis--xx")
            .attr("transform", "translate(0," + this.height2 + ")")
            .call(this.xAxis2);

        context.append("path")
              .datum(data)
              .attr("class", "area")
              .attr("d", area2);
    }
    testDraw(data){
        //this.svg.selectAll('path').remove();
        this.svg.selectAll('.line').remove();
        this.svg.selectAll('.axis--x').remove();
        x.domain(d3.extent(data, function(d) { return d.date; }));
        xAxis = d3.axisBottom(x).ticks(7);

        //draw the line
        focus.append('path')
                .attr("clip-path", "url(#clip)")
                .datum(data)
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("class", "line")
                .attr("d", line)
                .on('mouseover', (d) => {
                    //console.log(d);
                })

        focus.append("g")
              .attr("class", "axis axis--x")
              .attr("transform", "translate(0," + this.height *0.5+ ")")
              .call(xAxis);
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
    filterData(data){
        var filteredData = _.groupBy(data, d => {
            var t = new Date(d.date)
            return t;
        })

        let newObj = [];
        for(let value in filteredData){
            let val = filteredData[value].length/100;
            let obj = {
                'date': new Date(value),
                'value': val,
            }
            newObj.push(obj);
        }
        this.drawContext(newObj)
        this.testDraw(newObj);

    }

}

export default TimeComponent;
