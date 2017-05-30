var d3 = require('d3');
import p from 'es6-promise';
import $ from 'jquery';
import _ from 'underscore';

var x;
var y;
class TimeComponent {
    constructor(){
        this.init();
    }
    init() {
        this.margin = {top: 20, right: 30, bottom: 20, left: 30};
        this.width = document.getElementById('line-chart').clientWidth - this.margin.left - this.margin.right;
        this.height = document.getElementById('line-chart').clientHeight - this.margin.bottom - this.margin.top;

        this.svg = d3.select('#line-chart').append('svg')
                                .attr('width', this.width)
                                .attr('height', this.height)
                                .attr('transform', 'translate('+this.margin.left + ',' +this.margin.top+')')
                                .append("g").attr("transform","translate(" + this.margin.left + "," +this.margin.top + ")");

        // set the ranges
        x = d3.scaleTime().rangeRound([0,this.width]);
        y = d3.scaleLinear().range([this.height-this.margin.top, 0]);

        //append tooltip
        this.div = d3.select('#line-chart').append('div').attr('class', 'tooltip')

    }
        drawAxis(nrOfTicks){
            this.svg.selectAll('g').remove();
            //add the x-axis to the svg
            let a = this.height - this.margin.top - this.margin.bottom;
             this.svg.append("g")
                 .attr("transform", "translate(0," + a + ")")
                 .call(d3.axisBottom(x).ticks(nrOfTicks))


            //add the y-axis to the svg
            this.svg.append("g")
                .attr("transform", "translate(0," + -10 + ")")
               .call(d3.axisLeft(y))
        }

        getTwitterData(topic){
                let promise = new p.Promise((resolve, reject) => {
                    $.ajax({
                        type: 'GET',
                        url: '/twitter/content/'+topic,
                    }).then((res) => {
                        this.cleanData(res)
                    })
                })
        }
        cleanData(data){
            for(let value of data){
                let date = value.created_at.toString().split(' ');
                date = date[0]+' '+date[1]+' '+date[2];
                value.date = date;
            }
            data = _.groupBy(data, 'date');
            let newObj = [];

            for(let value in data){
                let obj = {
                    'date': new Date(value),
                    'value': data[value].length,
                }
                newObj.push(obj);
            }
            this.draw(newObj)
        }

    draw(data){
        this.svg.selectAll('path').remove();
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.value; })]);

        this.drawAxis(data.length);

        var line = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.value); })

        this.svg.append("g")
            .append('path')
            .datum(data)
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("class", "line")
            .attr("d", line)
            .on('mouseover', (d) => {
                //console.log(d);
            })
    }
}

export default TimeComponent;
