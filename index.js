var pg = require('pg');
var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mbx = require('mapbox');

app.set('port', (process.env.PORT || 5000));

var mbxAccessToken = "{your secret token with datasets scopes here}";
var mapboxClient = new mbx(mbxAccessToken);

app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next){
 	res.header("Access-Control-Allow-Origin", "*");
 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	next();
});
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/cool', function(request, response){
	response.send(cool());
});

app.post('/dataset', function(req, res){
	console.log(req.body.feature);
	var feature = req.body.feature;
	var datasetId = req.body.datasetId;
	mapboxClient.insertFeature(feature, datasetId, function(err, feature) {
	  // res is a GeoJSON document with geocoding matches
	  if (err) { console.log(err); }
	  else { console.log(feature); res.send(feature); }
	  
	});
});

app.get('/dataset', function(req, res) {
	mapboxClient.listFeatures(req.query.datasetId, {}, function(err, collection) {
	  console.log(collection);
	  res.send(collection);
	});

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


