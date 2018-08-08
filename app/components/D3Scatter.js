//var d3 = require('d3');
import * as d3 from 'd3';

const COLORS = ['#124C02', '#27797F', '#3DBFC9'];
const SELECTED_COLOR = '#3DBFC9';
const CIRCLE_RADIUS = 10;

class D3Scatter {
  constructor(map) {
    this.height = null;
    this.width = null;
    this.map = map;
    this.init();
    this.initBrush();
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

    var color = d3.scaleThreshold()
      .domain([0, 1])
      .range(COLORS);

    var x = d3.scaleLinear()
      .domain([0, 1])
      .rangeRound([600, 860]);
  }

  initBrush() {
    let brush = d3.brush()
      .on('end', () => this.handleBrushEnd())

    // TODO: if needed
    //  .on('brush', () => this.handleBrush())

    this.svg.append('g')
      .attr('class', 'brush')
      .call(brush);
  }

  drawCircles(data) {
    this.svg.selectAll('.dot').remove();

    this.svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', CIRCLE_RADIUS)
      .attr('cy', (d, i) => { return this.map.project(d.LngLat).y })
      .attr('cx', (d, i) => { return this.map.project(d.LngLat).x })
      .style('fill', (d) => {
        return COLORS[0];
      })
      .on('click', d => {
        console.log('onClick ', d)
        this.selectDot(d);
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

      this.map.on('moveend', e => {
        // TOOD: reset the brush if it exist
      })
  }

  selectDot(dataPoint) {
    this.setColorForSinglePoint(dataPoint)
  }

  setColorForSinglePoint(datum) {
    d3.selectAll('.dot').style('fill', d => {
      if (datum.id === d.id) {
        return SELECTED_COLOR;
      }
      else {
        return COLORS[0];
      }
    });
  };

  handleBrushEnd() {
    const selection = d3.event.selection;
    let circles = d3.selectAll('.dot');

    if (selection) {
      const nw = this.map.unproject(selection[0]);
      const se = this.map.unproject(selection[1]);
      this.brushedArea = [nw, se];
      circles.style('fill', (d, i) => {
        if (d.coords.coordinates[1] <= nw.lat
          && d.coords.coordinates[0] >= nw.lng
          && d.coords.coordinates[1]>= se.lat
          && d.coords.coordinates[0] <= se.lng) {
            return COLORS[1];
          } else {
            return COLORS[0];
          }
      })

    } else {
      circles.style('fill', COLORS[0]);
    }
  }
} export default D3Scatter;
