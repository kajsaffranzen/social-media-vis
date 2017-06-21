import moment from 'moment';
import tz from 'moment-timezone'

var d3 = require('d3');


class SliderComponent {
    constructor(){
        this.inputMax = 0;
        this.inputMin = 0;
        this.max = 5;
        this.min = 0;
        //this.init();
        this.init2();
    }
   init2(){
       //var today = moment().tz('Europe/Stockholm').format('YYYY-MM-DD');
       var label = []
       for(var i = 0; i < 7; i++){
           var d = new Date(moment().subtract(i, 'day').format('YYYY-MM-DD'))
           label.push( d)
       }


       var drag = d3.drag()
            .on('drag', dragMove)
            .on('end', dragEnd);

        this.margin = {top:10, right:20, bottom:10, left:20}
        this.width = 800;
        this.height = document.getElementById('slider-section').clientHeight-10;
        this.svg = d3.select('#slider-section').append('svg')
                            .attr('width', this.width)
                            .attr('height', this.height)

        var slider = this.svg.selectAll('g')
            .data([{x: 10, y : 20}])
            .enter()
            .append("g")
            .attr("class", "slider")
            .attr("transform", "translate(" + this.margin.left + "," + this.height / 2 + ")");

            var x = d3.scaleTime().rangeRound([0, (this.width-50)])
            x.domain(d3.extent(label, function(d) { return d; }));


        var rect = slider
            .append('rect')
            .attr("x1", x.range()[0])
            .attr("x2", x.range()[1])
            .attr('y', 17)
            .attr("height", 5)
            .attr("width", (this.width-40))
            .attr('fill', '#C0C0C0');

        slider.insert("g", ".track-overlay")
            .attr("class", "ticks")
            .attr("transform", "translate(0," + 18 + ")")
          .selectAll("text")
          .data(x.ticks(7))
          .enter().append("text")
            .attr("x", x)
            .attr("text-anchor", "middle")
            .text(function(d) { return moment(d).format('MMM Do') ; });

            var circle = slider.insert("circle")
                .attr("r", 20)
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .attr("fill", "#2394F5")
                .call(drag);

    function dragMove(d) {

            d3.select(this)
                .attr("opacity", 0.6)
                .attr("cx", d.x = Math.max(0, Math.min(760, d3.event.x)))
                .attr("cy", d.y = 20);
        }

        function dragEnd() {
            var s1 = x.invert(d3.event.x); //gets value
            var s = d3.event.x; //gets y-position
            console.log(s1);
            d3.select(this)
                .attr('opacity', 1)
        }
}
    dragEnd(){
        var s = d3.event.x;
        d3.select(this)
            .attr('opacity', 1)
    }

} export default SliderComponent;
