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
}// /getDate()

function buildLine( dataset ) {

  var minDate = getDate(dataset.monthlySales[0]['month']);
  var maxDate = getDate(dataset.monthlySales[dataset.monthlySales.length-1]['month']);

  var tooltip = d3.select('body').append('div')
    .attr({
      class: 'tooltip'
    })
    .style({
      opacity: 0
    });

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
        height: h,
        id: 'svg-'+dataset.category
      });

  var xAxis = svg.append('g')
    .call(xAxisGen)
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,'+(h-padding)+')');


  var yAxis = svg.append('g')
    .call(yAxisGen)
    .attr('class', 'y-axis')
    .attr('transform', 'translate('+padding+', 0)');

  var viz = svg.append('path')
    .transition()
    .duration(300)
    .ease('quad')
    .attr({
      d: lineFun(dataset.monthlySales),
      stroke: '#333',
      'stroke-width': 2,
      'fill': 'none',
      'class': 'path-' + dataset.category
    });

  var visibledots = svg.selectAll('circle.circle-'+dataset.category)
    .data( dataset.monthlySales )
    .enter()
    .append('circle')
    .attr({
      cx: (d) => { return xScale(getDate(d.month)); },
      cy: (d) => { return yScale(d.sales); },
      r: 3,
      class: 'circle-' + dataset.category,
      fill: '#F03'
    });

  // larger invisible dots for displaying the tooltip.
  var hoverdots = svg.selectAll('circle.circle-hover-'+dataset.category)
    .data( dataset.monthlySales )
    .enter()
    .append('circle')
    .attr({
      cx: (d) => { return xScale(getDate(d.month)); },
      cy: (d) => { return yScale(d.sales); },
      r: 15,
      class: 'circle-hover-' + dataset.category,
      'fill-opacity': 0
    })
    .style({
      cursor: 'pointer'
    })
    .on( 'mouseover', (d) => {
      tooltip
        .transition()
        .duration(300)
        .style('opacity', .75)
      tooltip
        .html('<strong>Sales $'+d.sales+'K</strong>')
        .style({
          left: (d3.event.pageX) + 'px',
          top: (d3.event.pageY - 28) + 'px'
        })
    })
    .on( 'mouseout', (d) => {
      tooltip
        .transition()
        .duration(150)
        .style( 'opacity', 0 );
    });
}// /buildLine()

function updateLine( dataset ) {
  console.log( dataset );

  var minDate = getDate(dataset.monthlySales[0]['month']);
  var maxDate = getDate(dataset.monthlySales[dataset.monthlySales.length-1]['month']);

  var tooltip = d3.select('body').append('div')
    .attr({
      class: 'tooltip'
    })
    .style({
      opacity: 0
    });

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
    .tickFormat(d3.time.format('%b'))
    .ticks( dataset.monthlySales.length - 1 );

  var yAxisGen = d3.svg.axis().scale(yScale).orient('left');

  var lineFun = d3.svg.line()
    .x( (d) => { return xScale(getDate(d.month)); })
    .y( (d) => { return yScale(d.sales); })
    .interpolate('linear');

  var svg = d3.select('body').select('#svg-'+dataset.category);

  var xAxis = svg.selectAll('g.x-axis').call(xAxisGen);

  console.log( dataset );

  var yAxis = svg.selectAll('g.y-axis').call(yAxisGen);;

  var viz = svg.selectAll('.path-'+dataset.category)
    .transition()
    .duration(1000)
    .ease('quad')
    .attr({
      d: lineFun(dataset.monthlySales)
    });

  var visibledots = svg.selectAll('.circle-'+dataset.category)
    .transition()
    .duration(1000)
    .ease('quad')
    .attr({
      cx: (d) => { return xScale(getDate(d.month)); },
      cy: (d) => { return yScale(d.sales); }
    });

  var hoverdots = svg.selectAll('.circle-hover-'+dataset.category)
    .on( 'mouseover', (d) => {
      tooltip
        .transition()
        .duration(300)
        .style('opacity', .75)
      tooltip
        .html('<strong>Sales $'+d.sales+'K</strong>')
        .style({
          left: (d3.event.pageX) + 'px',
          top: (d3.event.pageY - 28) + 'px'
        })
    })
    .on( 'mouseout', (d) => {
      tooltip
        .transition()
        .duration(150)
        .style( 'opacity', 0 );
    })
    .transition()
    .duration(1000)
    .ease('quad')
    .attr({
      cx: (d) => { return xScale(getDate(d.month)); },
      cy: (d) => { return yScale(d.sales); }
    });
}// /updateLine()

function calcTotal( dataset ) {
  var salesTotal = 0;

  for ( var i=0; i < dataset.length; i++ ) {
    salesTotal += dataset[i]['sales']*1; // convert to number
  }

  return salesTotal;
}// /calcTotal()

function calcAvg( dataset ) {
  var total = calcTotal( dataset );
  return (total / dataset.length);
}// /calcAvg()

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
}// /showTotals

function showHeader (dataset) {
  d3.select('body')
    .append('h1')
    .text(dataset.category + ' Sales (2013)');
}// /showHeader()

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

  d3.select( 'select' )
    .on( 'change', (d, i) => {
      var sel = d3.select('#date-option').node().value;

      var json = JSON.parse(window.atob(data.content));
      var contents = json.contents;

      contents.forEach((ds) => {
        var len = ds.monthlySales.length;
        ds.monthlySales.splice(0, len - sel );
        updateLine( ds );
      });
    });// /d3.select('select')
});// /d3.json()