var d3 = require('d3');

const colors = ['#124C02', '#27797F', '#3DBFC9'];

class D3Scatter {
  constructor(map) {
    this.height = null;
    this.width = null;
    this.map = map;
    this.init();
  }

  init() {
    this.height = document.getElementById('map').clientHeight;
    this.width = document.getElementById('map').clientWidth;

    //Set up d3
    const container = this.map.getCanvasContainer();

    this.svg = d3.select(container).append('svg')
      .attr('width', this.width)
      .attr('height', this.height)

    let div = d3.select(container).append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    let brush = d3.brush().on('end', this.brushMap);

    this.svg.append('g')
      .attr('class', 'brush')
      .call(brush);

    var color = d3.scaleThreshold()
      .domain([0, 1])
      .range(colors);

    var x = d3.scaleLinear()
      .domain([0, 1])
      .rangeRound([600, 860]);
  }

  drawCircles(data) {
    this.svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 10)
      .attr('cy', (d, i) => { return this.map.project(d.LngLat).y })
      .attr('cx', (d, i) => { return this.map.project(d.LngLat).x })
      .style('fill', (d) => {
        return '#008C43';
      })

      //adjust all d3-elements when zoomed
      this.map.on('move', (e) => {
        this.svg.selectAll('.dot')
          .attr('cx', (d) => {
            return this.map.project(d.LngLat).x
          })
          .attr('cy', (d) => {
            return this.map.project(d.LngLat).y
          })
          .on('click', (d) => {
            this.selectDot(d);
          })
      })
  }
} export default D3Scatter;
