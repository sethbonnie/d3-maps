import d3 from 'd3';
import faker from 'faker';

var offset = 10;

function genMonthlySales (size, incr, max = 25) {
  var result = [];

  for ( let i = 1; i <= size; i++ ) {
    result.push({
      month: i*incr,
      sales: faker.random.number(max)
    });
  }
  return result;
}

function labelType( cur, prev, next ) {
  if ( prev === undefined || prev < cur ) {
    if ( next === undefined || next > cur ) {
      // the current point is on an upward slope
      return 'climb';
    }
    else {
      // the current point is a peak
      return 'hill';
    }
  }
  else if ( prev >= cur ) {
    if ( next === undefined || next <= cur ) {
      // the current point is on a downward slope
      return 'downslope';
    }
    else {
      // the current point is at the botton of valley
      return 'valley';
    }
  }
}

function labelPositionX( val, type ) {
  switch (type) {
    case 'hill': 
      // the label will be above and in the middle, so x won't move
      return val;
    case 'valley': 
      // the label will be below and in the middle, so x won't move
      return val;
    case 'climb': 
      // the label will be up and to the left, so x is negatively offset
      return val - offset;
    case 'downslope':
      // the label will be up and to the right, so x is positibely offset
      return val + offset;
    default: 
      // Unexpected type, just return the value
      return val;
  }
}

function labelPositionY( val, type ) {
  switch (type) {
    case 'hill':
      // the label will be up and in the middle, so x is positively offset
      return val - offset;
    case 'valley':
      // the label will be down and in the middle, so y is positively offset
      return val + offset;
    case 'climb':
      // the label will be up and to the left, so y is negatively offset
      return val - offset;
    case 'downslope':
      // the label will be up and to the right, so y is negatively offset
      return val - offset;
    default:
      // Unexpected type, just return the value
      return val;
  }
}

var h = 200;
var w = 400;
var incr = 10;
var monthlySales = genMonthlySales(12, incr,100);
var lineFun = d3.svg.line()
                .x((d) => { return d.month/incr * w/monthlySales.length; })
                .y((d) => { return h*.8 - d.sales; })
                .interpolate('linear');

var svg = d3.select('body').append('svg')
            .attr({
              width: w,
              height: h
            });

var viz = svg.append('path')
            .attr({
              d: lineFun( monthlySales ),
              stroke: 'purple',
              'stroke-width': 2,
              fill: 'none'
            });

var labels = svg.selectAll('text')
                .data(monthlySales)
                .enter()
                .append('text')
                  .text((d) => { return d.sales })
                  .attr({
                    x: (d, i) => {
                      var prev = monthlySales[i-1] ? monthlySales[i-1].sales : undefined;
                      var next = monthlySales[i+1] ? monthlySales[i+1].sales : undefined;
                      var val = d.month/incr * w/monthlySales.length;
                      var type = labelType(d.sales, prev, next);

                      return labelPositionX(val, type); 
                    },
                    y: (d, i) => {

                      var prev = monthlySales[i-1] ? monthlySales[i-1].sales : undefined;
                      var next = monthlySales[i+1] ? monthlySales[i+1].sales : undefined;
                      var val =  h*.8 - d.sales;
                      var type = labelType(d.sales, prev, next);

                      return labelPositionY(val, type);
                    },
                    fill: (d) => {
                      if ( d.sales > 70 )
                        return '#42C0FB';
                      else if ( d.sales < 30 )
                        return '#F03';
                      else
                        return '#666';
                    },
                    'font-weight': (d) => {
                      if ( d.sales > 70 || d.sales < 30 )
                        return 'bold';
                      else
                        return 'normal';
                    },
                    'font-size': '12px',
                    'text-anchor': 'middle',
                    'dy': '.75em'
                  })