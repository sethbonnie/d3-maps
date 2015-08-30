import d3 from 'd3';

var h = 100;
var w = 400;

// dataset
var ds;
var filepath = 'contents/monthlySalesbyCategoryMultiple.json';
var apiAddr = 'https://api.github.com/repos/bsullins/d3js-resources/' + filepath;

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
      d: lineFun(dataset.monthlySales),
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
    'Sales Total: ' + calcTotal(dataset.monthlySales),
    'Sales Avg: ' + calcAvg(dataset.monthlySales).toFixed(2)
  ];
  var tr = t.selectAll('tr')
    .data(metrics)
    .enter()
    .append('tr')
    .append('td')
    .text((d) => { return d; });
}

function showHeader (dataset) {
  d3.select('body')
    .append('h1')
    .text(dataset.category + ' Sales (2013)');
}

d3.json( apiAddr, (err, data) => {
  if ( err ) {
    console.log( err );
    return;
  }

  var json = JSON.parse(window.atob(data.content));
  var contents = json.contents;

  console.log( contents );
  contents.forEach((ds) => {
    showHeader( ds )
    buildLine( ds );
    showTotals( ds );
  });
});
