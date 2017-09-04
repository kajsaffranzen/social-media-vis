import timeCalculation from '../timeCalculation';
import Mapbox from './Mapbox.js'
import moment from 'moment';
import tz from 'moment-timezone'

var d3 = require('d3');

let min, max;
let map;
let lineHeight = 8;

class SliderComponent {
    constructor(mapbox){
        map = mapbox;
        this.inputMax = 0;
        this.inputMin = 0;
        max = moment().format('YYYY-MM-DD hh:mm')
        min = moment().subtract(5, 'minute').format('YYYY-MM-DD hh:mm')
        //this.map = new Mapbox();
        this.init();
    }
   init(){

       var label = []
       for(var i = 0; i < 6; i++){
           var d = new Date(moment().subtract(i, 'day').format())
           label.push( d)
       }

       var drag = d3.drag()
            .on('drag', dragMove)
            .on('end', dragEnd);

    var drag2 = d3.drag()
         .on('drag', dragMove2)
         .on('end', dragEnd2);


        this.margin = {top:10, right:20, bottom:10, left:20}
        this.width = 900;
        this.height = document.getElementById('slider-section').clientHeight-10;
        this.svg = d3.select('#slider-section').append('div').append('svg')
                            .attr('width', this.width)
                            .attr('height', this.height)

            let div = d3.select('#slider-section').append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

                let max_pos = this.width-40;
                let min_pos = this.width-100;

        var slider = this.svg
            .append("g")
            .attr("class", "slider")
            .attr("transform", "translate(" + this.margin.left + "," + 35+ ")");

            var x = d3.scaleTime().rangeRound([0, (this.width)])
            x.domain(d3.extent(label, function(d) { return d; }));


        var rect = slider
            .insert('rect')
            .attr("x1", x.range()[0])
            .attr("x2", x.range()[1])
            .attr('y', 17)
            .attr("height", lineHeight)
            .attr("width", this.width-40)
            .attr('fill', '#C0C0C0');

        var rect2 = slider
            .insert('rect')
            /*.attr("x1", x.range()[1])
            .attr("x2", (this.width-10))*/
            .attr('x', this.width-100)
            .attr('y', 17)
            .attr("height", lineHeight)
            .attr("width", 40)
            .attr('fill', 'red');


         slider.insert("g", ".track-overlay")
            .attr("class", "ticks")
            .attr("transform", "translate(0," + 45 + ")")
            .selectAll("text")
            .data(x.ticks(7))
            .enter().append("text")
            .attr("x", x)
            .attr("text-anchor", "middle")
            .text(function(d) { return moment(d).format('MMM Do') ; })

            var circle = slider.insert("circle")
                .attr("r", 10)
                .attr("cx", this.width-100)
                .attr("cy", 20)
                .attr("fill", "#2394F3")
                .call(drag);


            var circle2 = slider.insert("circle")
                .attr("r", 10)
                .attr('class', 'circle2')
                .attr("cx", this.width-40)
                .attr("cy", function(d) { return 20; })
                .attr("fill", "#2394F3")
                .call(drag2)
                //.call(d3.drag().on('drag', function () {dragMove2(d3.event.x)}))
                .on('mouseover', () => {

                })

                colorArea();


        function dragMove() {
            let time = moment(new Date(x.invert(d3.event.x)));

            div.transition()
                 .duration(100)
                 .style("opacity", .9)
                 div.html(time.format('YYYY-MM-DD hh:mm'))
                 .style("left", d3.event.x + "px")
                 .style("top", this.height*1.5 + "px")

            d3.select(this)
                .attr("opacity", 0.6)
                .attr("cx", (d) => {
                    if(max_pos < d3.event.x)
                        return  (max_pos-10)
                    else
                        return Math.max(0, Math.min(860, d3.event.x))
                })
                .attr("cy", d.y = 20);

                colorArea();

                min = x.invert(d3.event.x);
                let a = [moment(min).format('YYYY-MM-DD hh:mm'), moment(max).format('YYYY-MM-DD hh:mm')]
                map.dataPreview(a);
        }

        function dragEnd() {
            var s1 = x.invert(d3.event.x); //gets value
            min_pos = d3.event.x; //gets y-position

            console.log(moment(s1).format('YYYY-MM-DD hh:mm'));
            d3.select(this)
                .attr('opacity', 1)

                colorArea();
            min = x.invert(d3.event.x);
            let a = [min, max]
            map.setTimeIntervals(a);
        }

        //drag functions for the second circle
        function dragMove2() {
            let time = moment(new Date(x.invert(d3.event.x)));
            max = x.invert(d3.event.x);
            div.transition()
                 .duration(100)
                 .style("opacity", .9)
                 div.html(time.format('YYYY-MM-DD hh:mm'))
                 .style("left", d3.event.x + "px")
                 .style("top", this.height*1.5 + "px")

                d3.select(this)
                    .attr("opacity", 0.6)
                    .attr("cx", function(d) {
                        if(min_pos > d3.event.x)
                            return  (min_pos+10)
                        else
                            return Math.max(0, Math.min(860, d3.event.x))
                    })
                    .attr("cy", d.y = 20);

            let a = [moment(min).format('YYYY-MM-DD hh:mm'), moment(max).format('YYYY-MM-DD hh:mm')]
            map.dataPreview(a);

        }

        function dragEnd2() {
            var s1 = x.invert(d3.event.x); //gets value
            max_pos = d3.event.x; //gets y-position

            d3.select(this)
                .attr('opacity', 1)

            colorArea();
            max = x.invert(d3.event.x);
            let a = [min, max]
            map.setTimeIntervals(a);
        }

        //change color of area in between
        function colorArea(){

            rect2.attr('x', min_pos)
                    .attr("height", lineHeight)
                    .attr("width", (max_pos - min_pos))
                    .attr('fill', 'red');
        }
}

    getCirclePositions(){
        return [min, max];
    }

} export default SliderComponent;
