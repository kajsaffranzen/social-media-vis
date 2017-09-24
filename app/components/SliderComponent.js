import timeCalculation from '../timeCalculation';
import Mapbox from './Mapbox.js'
import moment from 'moment';
import tz from 'moment-timezone'

var d3 = require('d3');

let min, max, rectWidth;
let map;

class SliderComponent {
    constructor(mapbox){
        map = mapbox;
        this.inputMax = 0;
        this.inputMin = 0;
        this.barHeight = 10;
        max = moment().format('YYYY-MM-DD hh:mm')
        min = moment().subtract(5, 'minute').format('YYYY-MM-DD hh:mm')
        //this.map = new Mapbox();
        this.init();
    }

   init(){
       //update slider values each minute
       setInterval(function(){
           updateSliderRange();
           //document.getElementById("time-span").innerHTML = moment().format('LTS');
       }, 60000);

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
        //this.width = document.getElementById('slider-section').clientWidth-10;
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

        var x = d3.scaleTime().rangeRound([0, (this.width)])
        x.domain(d3.extent(label, function(d) { return d; }));
        console.log('x.range()[0]: ' + x.invert(x.range()[0]));
        console.log('x.range()[1]: ' + x.invert(x.range()[1]));

        this.barWidth = this.width-40;
        rectWidth = this.width-40;

        //add current time label
        var current_time_text = slider.insert('text')
            .attr('x', this.width-80)
            .attr('y', 55)
            .text(function(d) { return moment(d).format('LT') ; })

        var rect = slider.insert('rect')
            .attr("x1", x.range()[0])
            .attr("x2", x.range()[1])
            .attr('y', 17)
            .attr("height", this.barHeight)
            .attr("width", this.barWidth)
            .attr('fill', '#C0C0C0');

        var rect2 = slider.insert('rect')
            /*.attr("x1", x.range()[1])
            .attr("x2", (this.width-10))*/
            .attr('x', this.width-50)
            .attr('y', 17)
            .attr("height", this.barHeight)
            .attr("width", 40)
            .attr('fill', 'red');


            updateSliderRange();

            function updateSliderRange(){
                current_time_text.text(function(d) { return moment(d).format('LT') ; })
                var label2 = []
                for(var i = 0; i < 7; i++){
                    var d = new Date(moment().subtract(i, 'day').format())
                    label2.push( d)
                }
                x.domain(d3.extent(label2, function(d) { return d; }));
                rect.attr("x1", x.range()[0])
                        .attr("x2", x.range()[1])
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


        function dragMove() {
            let time = 0;
            if(d3.event.x < 1)
                time = moment(new Date(x.invert(x.range()[0])));
            else
                time = moment(new Date(x.invert(d3.event.x)));

            div.transition()
                 .duration(100)
                 .style("opacity", .9)
                 div.html(time.format('YYYY-MM-DD LT'))
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
            updateTooltip();
            console.log(moment(s1).format('YYYY-MM-DD LT'));

            d3.select(this)
                .attr('opacity', 1)

            colorArea();
            min = x.invert(d3.event.x);
            let a = [min, max]
            map.setTimeIntervals(a);

            //make the tooltip disappear
            div.transition()
              .duration(500)
              .style("opacity", 0);
        }

        //drag functions for the second (max) circle
        function dragMove2() {
            let time = 0;
            if(d3.event.x > rectWidth)
                time = moment(new Date(x.invert(x.range()[1])));
            else
                time = moment(new Date(x.invert(d3.event.x)));

            max = x.invert(d3.event.x);
            div.transition()
                 .duration(100)
                 .style("opacity", .9)
                 div.html(time.format('YYYY-MM-DD LT'))
                 .style("left", d3.event.x + "px")
                 .style("top", this.height*1.5 + "px")

                d3.select(this)
                    .attr("opacity", 0.6)
                    .attr("cx", function(d) {
                        if(min_pos > d3.event.x)
                            return  (min_pos+10)
                        else
                            return Math.max(0, Math.min(rectWidth, d3.event.x))
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

            updateTooltip();
            colorArea();

            max = x.invert(d3.event.x);
            let a = [min, max]
            map.setTimeIntervals(a);
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
