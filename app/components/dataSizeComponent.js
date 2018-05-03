/* component for, throguh labels, showing the number of tweets */

class dataSizeComponent {
    constructor(D3) {
      this.svg = D3;
      this.height = document.getElementById('map').clientHeight;
      this.width = document.getElementById('map').clientWidth;
      this.init();
    }

    /* draw labels */
    init() {
      let infoTxt = ['with geo location', 'total number of tweets']

      this.svg.selectAll('text.title')
        .data(infoTxt)
        .enter()
        .append('text')
        .attr('class', 'text-title')
        .attr('x', 60)
        .attr('y', (d, i) => { return this.height- (35 + (i*20)) })
        .style('text-anchor', 'left')
        .text((d) => { return d});
    }

    /* update info about size of the data */
    updateNumbers(all, geo) {
      this.svg.selectAll('.text-value').remove();
      let tweets = [geo, all];

      this.svg.selectAll('text.value')
        .data(tweets)
        .enter()
        .append('text')
        .attr('class', 'text-value')
        .attr('x', 20)
        .attr('y', (d, i) => { return this.height- (32 + (i*20)) })
        .style('text-anchor', 'left')
        .text((d) => { return d});
    }

    redrawInfo() {
      this.svg.selectAll('.text-title').remove();
    //  this.svg.selectAll('.text-value').remove();

      this.init();
    }
} export default dataSizeComponent;
