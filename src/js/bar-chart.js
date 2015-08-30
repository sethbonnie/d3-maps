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
    });

svg.selectAll( 'text' )
  .data(dataset)
  .enter()
  .append('text')
    .text((d) => { return d })
    .attr({
      'text-anchor': 'middle',
      x: (d,i) => { 
        let l = dataset.length;

        return i * (w/l) + (w/l - padding) / 2
      },
      y: (d) => { 
        if ( d > 10 )
          return h - (d*h/max) + 14; 
        else
          return h - d*h/max - 2;
      },
      fill: (d) => {
        if ( d > 10 )
          return '#FFF';
        else
          return '#666'
      },
      'font-size': '10px'
    })