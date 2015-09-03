import d3 from 'd3';
import faker from 'faker';

/**
  * Return a nice red for the top any value in the top 90%
  */
function colorPicker(v, max) {
  if ( v < (max*.9) ) return '#666666';
  else return '#FF0033';
}

function genDataset( size, max = 100 ) {
  var result = [];

  for ( let i = 0; i < size; i++ ) {
    result.push( faker.random.number(max) );
  }
  return result;
}

var dataset = genDataset(10, 50);

var w = 300;
var h = 100;
var max = d3.max(dataset);
var padding = 2;
var svg = d3.select('body')
            .append('svg')
            .attr('width', w)
            .attr('height', h);

svg.selectAll( 'rect' )
  .data(dataset)
  .enter()
  .append('rect')
    .attr({
      'x': (d,i) => { return i * (w/dataset.length); },
      'y': (d) => { return h - (d*h/max); },
      'width': w/dataset.length - padding,
      'height': (d) => { return d * h/max; },
      'fill': (d) => { return colorPicker(d,max); }
    })
  .on( 'mouseover', function(d) {
    svg.append('text')
      .text(d)
      .attr({
        'text-anchor': 'middle',
        id: 'tooltip',
        x: parseFloat(d3.select(this).attr('x')) +
           parseFloat(d3.select(this).attr('width')) - 12,

        y: parseFloat(d3.select(this).attr('y')) + 12,
        fill: '#FFF',
        'font-size': '10px'
      })
  })
  .on( 'mouseout', () => {
    d3.select('#tooltip').remove();
  });

  