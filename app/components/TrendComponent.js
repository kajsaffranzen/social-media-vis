/*
    This class gets the trending topics from Twitter
    and visualize them to the user.
*/
//import TimeComponent from './TimeComponent';
import TopicRequest from '../TopicRequest';

import p from 'es6-promise';
import $ from 'jquery';
import _ from 'underscore';
var d3 = require('d3');

class TrendComponent {
    constructor(topicComponent){
        this.chosenTopic = null;
        this.theCoords = null;
        this.chosenPlace = null;
        this.topicRequest = topicComponent;
        this.init();
    }
    init(){
        //set up d3
        this.margin = {top: 5, right: 2, bottom: 0, left: 30};
        this.width = 500;
        this.height = 400;
        this.svg = d3.select('#bar-chart').append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr("transform", "translate(" + this.margin.right + "," + this.margin.top + ")");

        this.div = d3.select("bar-chart").append("div").attr("class", "tooltip");
        this.x = d3.scaleLinear().range([0, this.width-60]);
        this.y = d3.scaleBand().range([this.height, 0]);

        this. g = this.svg.append("g")
            .attr("transform", "translate(" + this.margin.left*2 + "," + this.margin.top + ") scale(0.8,0.9)")
            .style("font-weight","bold");

        this.drawAxis();
    }
    drawAxis(){
        this.g.select("y axis").remove()

        this.g.append("g")
           .attr("class", "y axis")
           .attr("transform", "translate("+this.margin.left+",0)")
           .call(d3.axisLeft(this.y));
    }
    getTrendData(coords, city){
        console.log('i getTrendData i TrendComponent');
        this.theCoords = coords;
        this.chosenPlace = city;

        let promise = new p.Promise((resolve, reject) => {
            $.ajax({
              type: 'GET',
              url: '/twitter-trend/'+coords[0]+'/'+coords[1],
          }).then((res) => {
              this.area = res[0].locations[0];
                console.log('i TrendComponent: ', res[0].locations[0].name);
                document.getElementById("trend-span").innerHTML = res[0].locations[0].name.toUpperCase();
                this.draw(res[0])
            });
        })
    }
    draw(d){
        this.g.selectAll(".bar").remove();
        this.g.selectAll(".value").remove();
        this.g.selectAll("g").remove();

        d = _.sortBy(d.trends, 'tweet_volume');
        let data = [];
        for(let value of d){
            if(value.tweet_volume != null)
                data.push(value);
        }

        this.x.domain([0, d3.max(data, function(d) { return d.tweet_volume; })])
        this.y.domain(data.map(function(d) { return d.name; })).padding(0.2);

        this.drawAxis();
        this.g.select("y axis") .call(this.y);// change the y axis

        var theBar = this.g.selectAll('.bar').data(data).enter();

        theBar.append("rect")
           .attr("class", "bar")
           .attr("transform", "translate("+this.margin.left+",0)")
           .style("fill", "#2394F3")
           .style('opacity', 0.5)
           .attr("x", 0)
           .attr("height", this.y.bandwidth())
           .attr("y", (d) => {
               if(d.tweet_volume !== null)
                   return this.y(d.name); })

           .attr("width", (d) => {
               if(d.tweet_volume !== null)
                    return this.x(d.tweet_volume);
            })
            .on('click', (d) => {
                console.log(d);
                this.topicRequest.getTwitterDataTrend(d.query, d.name, this.theCoords, this.chosenPlace);

                //this.time.getTwitterData(d.query, d.name, this.theCoords);
                d3.selectAll('.bar').style('fill', (data) => {
                    if(d.name === data.name)
                        return '#044C29';
                    else
                        return '#2394F3';
                })
            })

        //append tweet_volume numbers to each bar
        theBar.append('text')
            .attr('class', 'value')
            .attr("dx", (d) => {return this.x(d.tweet_volume)+70}) //margin right
            .attr("dy", this.y.bandwidth()*0.6) //vertical align middle
            .attr("text-anchor", "end")
            .text(function(d){
                //round up to neares thousand
                var num = d.tweet_volume;
                var rounded = -Math.round(-num / 1000);
                return rounded+'k';
            })
            .attr("y", (d) =>{  return this.y(d.name);  })
            .attr("x", function(d){
                return this.x(d.tweet_volume);
            })
            .style("fill", "white")
            .style("font-weight","bold")
    }
} export default TrendComponent;
