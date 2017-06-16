var d3 = require('d3');

class SliderComponent {
    constructor(){
        this.inputMax = 0;
        this.inputMin = 0;
        this.max = 5;
        this.min = 0;
        this.init();
    }
    init(){
        this.margin = {top:10, right:20, bottom:10, left:20}
        this.width = document.getElementById('slider-section').clientWidth-10;
        this.height = document.getElementById('slider-section').clientHeight-10;
        this.svg = d3.select('#slider-section').append('svg')
                            .attr('width', this.width)
                            .attr('height', this.height)

            //var slider = d3.slider().min(0).max(10).tickValues([1,3,5,7,10]);
        //appende slider
        var slider = this.svg.append("g")
                .attr("class", "slider")
                .attr("transform", "translate(" + this.margin.left + "," + this.height / 2 + ")");

        var x = d3.scaleLinear()
                .domain([0, 180])
                .range([0, 200])
                .clamp(true);

    slider.append("line")
            .attr("class", "track")
            .attr("x1", x.range()[0])
            .attr("x2", x.range()[1])
          .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr("class", "track-inset")
          .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr("class", "track-overlay")
            .call(d3.drag()
                .on("start.interrupt", function() { console.log(' i start.intro'); slider.interrupt(); })
                .on("start drag", function() { hue(x.invert(d3.event.x)); }));

                slider.insert("g", ".track-overlay")
            .attr("class", "ticks")
            .attr("transform", "translate(0," + 18 + ")")
          .selectAll("text")
          .data(x.ticks(10))
          .enter().append("text")
            .attr("x", x)
            .attr("text-anchor", "middle")
            .text(function(d) { return d + "°"; });

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9)
        .style('fill', '#000')

slider.transition() // Gratuitous intro!
    .duration(750)
    .tween("hue", function() {
        console.log(' i tween');
      var i = d3.interpolate(0, 70);
      return function(t) { hue(i(t)); };
    });

    function hue(h) {
        console.log(' i hue');
      handle.attr("cx", x(h));
      //this.svg.style("background-color", d3.hsl(h, 0.8, 0.8));
    }


        /*fill: #fff;
  stroke: #000;
  stroke-opacity: 0.5;
  stroke-width: 1.25px;*/

   }


} export default SliderComponent;
