import timeCalculation from '../timeCalculation';
import Mapbox from './Mapbox.js'
import moment from 'moment';
import tz from 'moment-timezone'
import $ from 'jquery';

var d3 = require('d3');

let min, max, rectWidth;
let map;
let isChecked;
let $checkbox;

class SliderComponent {
    constructor(mapbox){
        map = mapbox;
        $checkbox = $('#real-time-box');
        this.inputMax = 0;
        this.inputMin = 0;
        this.barHeight = 10;
        isChecked = true;
        max = moment().format('YYYY-MM-DD hh:mm')
        min = moment().subtract(5, 'minute').format('YYYY-MM-DD hh:mm')
        this.init();
    }

   init(){
       $("#real-time-box").on("click", () => {
           isChecked = $checkbox.is(':checked')
           if(isChecked) {
                document.getElementById("slider-section").style.opacity = 0.5;
           } else {
               document.getElementById("slider-section").style.opacity = 1;
           }

       })

       /*
       * updates time label every second and the slide range every minute
       */
       setInterval(function(){
           current_time_text.text(function(d) { return moment(d).format('LTS') ; })
           let newTime = moment().format('ss');
           if(newTime === '00' ) {
               updateSliderRange();
               if(!isChecked){
                   updateCirclePosition();
               }
           }
       }, 600);

       var label = []
       for(var i = 0; i < 7; i++){
           var d = new Date(moment().subtract(i, 'day').format())
           label.push( d)
       }
       console.log(label);

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
            .attr("transform", "translate(" + 10+ "," + 10 + ")"); //.style("fill", "green") //sets the color of the texts

        this.barWidth = this.width-40;
        rectWidth = this.width-40;

        var x = d3.scaleTime().rangeRound([0, (this.barWidth)])
        x.domain(d3.extent(label, function(d) { return d; }));

        //add current time label
        var current_time_text = slider.insert('text')
            .attr('x', this.width-80)
            .attr('y', 55)

        var rect = slider.insert('rect')
            .attr("x1", x.range()[0])
            .attr("x2", x.range()[1])
            .attr('y', 17)
            .attr("height", this.barHeight)
            .attr("width", this.barWidth)
            .attr('fill', '#C0C0C0');

        var rect2 = slider.insert('rect')
            .attr('x', this.width-50)
            .attr('y', 17)
            .attr("height", this.barHeight)
            .attr("width", 40)
            .attr('fill', 'red');

            updateSliderRange();

            function updateSliderRange(){
                var newLabel = []
                for(var i = 0; i < 7; i++){
                    var d = new Date(moment().subtract(i, 'day').format())
                    newLabel.push( d)
                }
                x.domain(d3.extent(newLabel, function(d) { return d; }));
                rect.attr("x1", x.range()[0])
                        .attr("x2", x.range()[1])
            }

            function updateCirclePosition() {
                //get new position from circles
                max = x.invert(d3.select('circle.circle2').attr('cx'))
                min = x.invert(d3.select('circle').attr('cx'))
                let a = [min, max]
                 map.setTimeIntervals([min, max]);
            }

         slider.insert("g", ".track-overlay")
            .attr("class", "ticks")
            .attr("transform", "translate(10," + 55 + ")")
            .selectAll("text")
            .data(x.ticks(8))
            .enter().append("text")
            .attr("x", x)
            .attr("text-anchor", "middle")
            .text(function(d) { return moment(d).format('MMM Do') ; })

        var circle = slider.insert("circle")
            .attr("r", this.barHeight*1.5)
            .attr("cx", this.width-90)
            .attr("cy", 22)
            .attr("fill", "#2394F3")
            .style('stroke', 'black')
            .call(drag);

        var circle2 = slider.insert("circle")
            .attr("r", this.barHeight*1.5)
            .attr('class', 'circle2')
            .attr("cx", this.width-40)
            .attr("cy", 22)
            .attr("fill", "#2394F3")
            .style('stroke', 'black')
            .call(drag2)
            .on('mouseover', () => {})

        colorArea();

        function updateCheckBox() {
            isChecked = false;
            $checkbox.prop('checked', false);
            document.getElementById("slider-section").style.opacity = 1;
        }

        function dragMove() {
            updateCheckBox();
            let time = 0;
            let n = max_pos-2;

            if(d3.event.x < 1)
                time = moment(new Date(x.invert(x.range()[0])));
            else
                time = moment(new Date(x.invert(d3.event.x)));

            d3.select(this)
                .attr("opacity", 0.6)
                .attr("cx", (d) => {
                    if(max_pos < d3.event.x) {
                        time = moment(new Date(x.invert(n)));
                        return  n;
                    }
                    else
                        return Math.max(0, Math.min(860, d3.event.x))
                })
                .attr("cy", d.y = 20);

            div.transition()
                 .duration(100)
                 .style("opacity", .9)
                 div.html(time.format('YYYY-MM-DD LT'))
                 .style("left", d3.event.x + "px")
                 .style("top", this.height*1.5 + "px")

            colorArea();

            min = x.invert(d3.event.x);
            let a = [moment(min).format('YYYY-MM-DD hh:mm'), moment(max).format('YYYY-MM-DD hh:mm')]
            map.dataPreview(a);
        }

        function dragEnd() {
            var s1 = x.invert(d3.event.x); //gets value
            min_pos = d3.event.x; //gets y-position
            updateTooltip();

            d3.select(this).attr('opacity', 1)

            colorArea();
            updateCirclePosition();

            //make the tooltip disappear
            div.transition()
              .duration(500)
              .style("opacity", 0);
        }

        //drag functions for the second (max) circle
        function dragMove2() {
            updateCheckBox();
            let time = 0;
            let n  = min_pos+2;

            if(d3.event.x > rectWidth) time = moment(new Date(x.invert(x.range()[1])));
            else time = moment(new Date(x.invert(d3.event.x)));

            max = x.invert(d3.event.x);

            d3.select(this)
                .attr("opacity", 0.6)
                .attr("cx", function(d) {
                    if(min_pos > d3.event.x){
                        time = moment(new Date(x.invert(n)));
                        return  n;
                    }
                    else
                        return Math.max(0, Math.min(rectWidth, d3.event.x))
                })
                .attr("cy", d.y = 20);

            div.transition()
                 .duration(100)
                 .style("opacity", .9)
                 div.html(time.format('YYYY-MM-DD LT'))
                 .style("left", d3.event.x + "px")
                 .style("top", this.height*1.5 + "px")

            let a = [moment(min).format('YYYY-MM-DD hh:mm'), moment(max).format('YYYY-MM-DD hh:mm')]
            map.dataPreview(a);
        }

        function dragEnd2() {
            var s1 = x.invert(d3.event.x); //gets value
            max_pos = d3.event.x; //gets y-position

            d3.select(this).attr('opacity', 1)

            updateTooltip();
            colorArea();
            updateCirclePosition();
        }

        //update tooltip after a circle has been moved
        function updateTooltip(){
            //remove the tooltip
            d3.selectAll('.tooltip').remove();

            //create the tooltip againt
            div = d3.select('#slider-section').append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
        }

        //change color of area in between the circles
        function colorArea(){
            var new_pos = (max_pos - min_pos)-10;
            rect2.attr('x', min_pos)
                    .attr("height", 10)
                    .attr("width", new_pos)
                    .attr('fill', "#2394F3")
                    .style('opacity', 0.5)
        }
    }

    getCirclePositions(){
        /*$("#real-time-box").on("click", () => {
            console.log('tjohe, har tryckt');
        })*/
        return [min, max];
    }

} export default SliderComponent;
