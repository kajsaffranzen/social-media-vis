/*
    This class gets the trending topics from Twitter
    and visualize them to the user.
*/
import TimeComponent from './TimeComponent';
import TopicRequest from '../TopicRequest';

import p from 'es6-promise';
import $ from 'jquery';
import _ from 'underscore';
var d3 = require('d3');

class TrendComponent {
    constructor(){
        this.chosenTopic = null;
        this.theCoords = null;
        //this.time = new TimeComponent();
        this.request = new TopicRequest();
        this.init();
    }
    init(){
        //set up d3
        this.margin = {top: 50, right: 20, bottom: 0, left: 30};
        //this.width = document.getElementById('bar-chart').clientWidth - this.margin.left - this.margin.right;
        this.width = 350;
        //this.height = document.getElementById('bar-chart').clientHeight - this.margin.bottom - this.margin.top;
        this.height = 400;
        this.svg = d3.select('#bar-chart').append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


        this.div = d3.select("bar-chart").append("div").attr("class", "tooltip");

        this.x = d3.scaleLinear().range([0, this.width-60]);
        this.y = d3.scaleBand().range([this.height, 0]);

        this. g = this.svg.append("g")
		          .attr("transform", "translate(" + this.margin.left*2 + "," + this.margin.top + ")");
        this.svg.append('text')
            .attr('class', 'graph-info')
            .attr('transform', 'translate(10, 10)')
            .style('text-anchor', 'left')
            .text('Popular topics ')
        this.drawAxis();

    }
    drawAxis(){
            this.g.select("y axis").remove()

            this.g.append("g")
               .attr("class", "y axis")
               //.style("font-color", "#fff")
               .attr("transform", "translate("+this.margin.left+",0)")
               .call(d3.axisLeft(this.y));

    }
    getTrendData(coords){
        this.theCoords = coords;
        console.log(coords);
        let promise = new p.Promise((resolve, reject) => {
            $.ajax({
              type: 'GET',
              url: '/twitter/trend/'+coords[0]+'/'+coords[1],
          }).then((res) => {
              this.area = res[0].locations[0];
                console.log('i TrendComponent: ', res[0].locations[0].name);
                this.draw(res[0])
            });
        })
    }
    draw(d){
        this.g.selectAll(".bar").remove();
        this.g.selectAll("g").remove();

        d = _.sortBy(d.trends, 'tweet_volume');
        let data = [];
        for(let value of d){
            if(value.tweet_volume != null)
                data.push(value);
        }

        this.x.domain([0, d3.max(data, function(d) { return d.tweet_volume; })])
        this.y.domain(data.map(function(d) { return d.name; })).padding(0.1);

        this.drawAxis();
        this.g.select("y axis") // change the y axis
            //.duration(750)
            .call(this.y);

           var theBar = this.g.selectAll(".bar")
                   .data(data)
                   .enter().append("rect")
                   .attr("class", "bar")
                   .attr("transform", "translate("+this.margin.left+",0)")
                   .style("fill", "#044C29")
                   .attr("x", 0)
                   .attr("height", this.y.bandwidth())
                   .attr("y", (d) => {
                       if(d.tweet_volume !== null)
                           return this.y(d.name); })

                   .attr("width", (d) => {
                       if(d.tweet_volume !== null)
                        return this.x(d.tweet_volume); })
                    .on('click', (d) => {
                        console.log(d);
                        this.request.getTwitterDataTrend(d.query, d.name, this.theCoords)
                        //this.time.getTwitterData(d.query, d.name, this.theCoords);
                        d3.selectAll('.bar').style('fill', (data) => {
                            if(d.name === data.name)
                                return '#3DBFC9';
                            else
                                return '#044C29';

                        })
                    })
                    .on('mouseover', (d) => {
                        console.log('hallå');
                        this.div.html('hejjsaodjisao')
                        .style("left", d3.event.pageX - 50 + "px")
                        .style("top", d3.event.pageY - 70 + "px")
                        .style("display", "inline-block")
                    })

            theBar.append('text')
                        //.data(data)
                        .attr('class', 'value')
                        .attr('y', this.y.bandwidth())
                        .attr('dx', 10)
                        .attr("dy", ".35em")
                        .attr('text-anchor', 'end')
                        .attr('x', (d) => {
                            return this.x(30)
                        })
                        .text((d) => {
                            return d.tweet_volume;
                        })
                        .style('font-size', 120)
                        .style('z-index', 10)
    }
}

export default TrendComponent;
