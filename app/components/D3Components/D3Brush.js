import * as d3 from 'd3';
import { Selection } from 'd3-selection';
import { COLORS, SELECTED_COLOR } from '../../variables'

class D3Brush {
  constructor(svg, map) {
    this.svg = svg;
    this.map = map;
    this.initBrush();
  }

  initBrush() {
    this.brush = d3.brush()
      .on('end', () => this.handleBrushEnd())

    // TODO: if needed
    //  .on('brush', () => this.handleBrush())

    this.svg.append('g')
      .attr('class', 'brush')
      .call(this.brush);
  }

  handleBrush() {
    return;
  }

  handleBrushEnd() {
    const selection = d3.event.selection;
    let circles = d3.selectAll('.dot');

    if (selection) {
      const nw = this.map.unproject(selection[0]);
      const se = this.map.unproject(selection[1]);
      this.brushedArea = [nw, se];

      circles.style('fill', d => {
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

  resetBrush() {
    this.svg.call(this.brush, null)
  }

} export default D3Brush;
