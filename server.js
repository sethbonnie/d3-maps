var express = require( 'express' );
var morgan = require( 'morgan' );
var port = process.env.PORT || 3030;
var routes = require( './routes' );
var app = express();

app.use( morgan('dev') );
app.use( express.static(__dirname + '/public') );

app.set( 'view engine', 'jade' );

app.use( routes );

app.listen( port, function () {

});