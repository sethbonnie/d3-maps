import d3 from 'd3';

var h = 200;
var w = 400;
var padding = 25;

// dataset
var ds;
var filepath = 'contents/monthlySalesbyCategoryMultiple.json';
var apiAddr = 'https://api.github.com/repos/bsullins/d3js-resources/' + filepath;

function getDate(d) {
  var strDate = new String(d);
  var year = strDate.substr(0,4);
  var month = strDate.substr(4,2) - 1;
  var day = strDate.substr(6,2);

  return new Date(year, month, day);
}

function buildLine( dataset ) {

  var minDate = getDate(dataset.monthlySales[0]['month']);
  var maxDate = getDate(dataset.monthlySales[dataset.monthlySales.length-1]['month']);

  var xScale = d3.time.scale()
                .domain([minDate, maxDate])
                .range([padding, w-padding]);

  var yScale = d3.scale.linear()
                .domain([
                  0, 
                  d3.max(dataset.monthlySales, (d) => { return d.sales; })
                ])
                .range([h-padding, 10]);

  var xAxisGen = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .tickFormat(d3.time.format('%b'));

  var yAxisGen = d3.svg.axis().scale(yScale).orient('left');

  var lineFun = d3.svg.line()
    .x( (d) => { return xScale(getDate(d.month)); })
    .y( (d) => { return yScale(d.sales); })
    .interpolate('linear');

  var svg = d3.select('body')
    .append('svg')
      .attr({
        width: w,
        height: h
      });

  var xAxis = svg.append('g')
    .call(xAxisGen)
    .attr('class', 'axis')
    .attr('transform', 'translate(0,'+(h-padding)+')');


  var yAxis = svg.append('g')
    .call(yAxisGen)
    .attr('class', 'axis')
    .attr('transform', 'translate('+padding+', 0)');

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

  contents.forEach((ds) => {
    showHeader( ds )
    buildLine( ds );
    showTotals( ds );
  });
});
