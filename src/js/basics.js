import d3 from 'd3';

var w = 200;
var h = 100;
var padding = 2;
var dataset = [5, 10, 15, 20, 25, 30, 35, 40];
var max = d3.max(dataset);
var svg = d3.select('body')
            .append('svg')
              .attr('width', w)
              .attr('height', h);

svg.selectAll('rect')
  .data(dataset)
  .enter()
  .append('rect')
    .attr('x', (d,i) => {return i*(w/dataset.length)})
    .attr('y', (d) => { return h - d*(h/max); })
    .attr('width', w / dataset.length - padding)
    .attr('height', (d) => {return d * (h/max)} )
    .style('fill', (d,i) => { return i%2===0 ? 'red' : 'orange'});