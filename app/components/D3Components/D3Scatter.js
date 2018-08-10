import * as d3 from 'd3';
import D3Brush from './D3Brush';

const COLORS = ['#124C02', '#27797F', '#3DBFC9'];
const SELECTED_COLOR = '#3DBFC9';
const CIRCLE_RADIUS = 10;

class D3Scatter {
  constructor(map) {
    this.height = null;
    this.width = null;
    this.map = map;
  }

  initSVG() {
    this.height = document.getElementById('map').clientHeight;
    this.width = document.getElementById('map').clientWidth;

    //Set up d3
    this.container = this.map.getCanvasContainer();

    this.svg = d3.select(this.container).append('svg')
      .attr('width', this.width)
      .attr('height', this.height)

    return this.svg;
  }

  init() {
    /*let div = d3.select(this.container).append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0); */

    // TODO är we using this?
    /*var color = d3.scaleThreshold()
      .domain([0, 1])
      .range(COLORS);

    var x = d3.scaleLinear()
      .domain([0, 1])
      .rangeRound([600, 860]); */

    // create brush and zoom funcionality
    this.brush = new D3Brush(this.svg, this.map);
    this.onZoom();
  }

  onZoom() {
    //adjust all d3-elements when zoomed
    this.map.on('move', (e) => {
      this.brush.resetBrush();

      this.svg.selectAll('.dot')
        .attr('cx', d => {
          return this.map.project(d.LngLat).x
        })
        .attr('cy', d => {
          return this.map.project(d.LngLat).y
        })
    })

    this.map.on('moveend', (e) => {
      this.brush.resetBrush();
      this.setColor()
    })
  }

  drawCircles(data) {
    this.svg.selectAll('.dot').remove();

    this.svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', CIRCLE_RADIUS)
      .attr('cy',(d) => { return this.map.project(d.LngLat).y })
      .attr('cx', (d) => { return this.map.project(d.LngLat).x })
      .style('fill', (d) => {
        return COLORS[0];
      })
      .on('click', (d) => {
        console.log('onClick ', d)
        this.selectDot(d);
      })
  }

  selectDot(dataPoint) {
    this.setColorForSinglePoint(dataPoint)
  }

  setColor() {
    d3.selectAll('.dot').style('fill', COLORS[0]);
  }

  setColorForSinglePoint(datum) {
    d3.selectAll('.dot').style('fill', (d) => {
      if (datum.id === d.id) {
        return SELECTED_COLOR;
      } else {
        return COLORS[0];
      }
    });
  }

} export default D3Scatter;
