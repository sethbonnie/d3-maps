import d3 from 'd3';

var h = 100;
var w = 400;

// dataset
var ds;

function buildLine( dataset ) {

  console.log( dataset );

  var lineFun = d3.svg.line()
    .x( (d) => { return (d.month - 20130001) / 3.25; })
    .y( (d) => { return (h - d.sales); })
    .interpolate('linear');

  var svg = d3.select('body')
    .append('svg')
      .attr({
        width: w,
        height: h
      });

  var viz = svg.append('path')
    .attr({
      d: lineFun(dataset),
      stroke: 'purple',
      'stroke-width': 2,
      'fill': 'none'
    });
}

function calcTotal( dataset ) {
  var salesTotal = 0;

  for ( var i=0; i < dataset.length; i++ ) {
    salesTotal += dataset[i]['sales']*1; // convert to number
  }

  return salesTotal;
}

function calcAvg( dataset ) {
  var total = calcTotal( dataset );
  return (total / dataset.length);
}

function showAvg( dataset ) {

}

function showTotals( dataset ) {
  var t = d3.select('body').append('table');
  var metrics = [
    'Sales Total: ' + calcTotal(dataset),
    'Sales Avg: ' + calcAvg(dataset).toFixed(2)
  ];
  var tr = t.selectAll('tr')
    .data(metrics)
    .enter()
    .append('tr')
    .append('td')
    .text((d) => { return d; });
}

d3.csv('/data/monthly-sales.csv', (err, data) => {
  if ( err ) {
    console.log( err );
    return;
  }

  buildLine( data );
  showTotals( data );
});
