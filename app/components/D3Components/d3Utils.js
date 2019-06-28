import * as d3 from 'd3'

export function createSvg(id, width, height) {
  const svg = d3.select('#'+id).append('svg')
    .attr('width', width)
    .attr('height', height)
  // .attr('transform', 'translate(' + margin.right + ',' + margin.top + ')');
}

// selection: string
function appendTooltip(selection) {
  this.div = d3.select(selection).append('div').attr('class', 'tooltip');
}
