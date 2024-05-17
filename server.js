var express = require('express');

var app = express();
var request = require('request');
app.set('port', 3005);

require('dotenv').config({path : '.env'});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, application/json, Accept");
  res.header("accept-charset, UTF-8");
  next();
});

app.get('/getplayersummary', function(req, res) {
	var qParams = [];
	for (var p in req.query) {
		qParams.push({'name':p, 'value':req.query[p]})
	}
var url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + process.env.REACT_APP_STEAM_API_KEY + '&steamids=' + qParams[0].name;
	request(url, function(err, response, body) {
		res.send(body);
		
	});	
});

app.get('/getownedgames', function(req, res) {
	var qParams = [];
	for (var p in req.query) {
		qParams.push({'name':p, 'value':req.query[p]})
	}
var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + process.env.REACT_APP_STEAM_API_KEY +'&steamid=' + qParams[0].name + '&format=json&include_appinfo=1"';
	request(url, function(err, response, body) {
			res.send(body);
	});	
});

app.get('/getrecentlyplayed', function(req, res) {
	var qParams = [];
	for (var p in req.query) {
		qParams.push({'name':p, 'value':req.query[p]})
	}
var url = 'http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=' + process.env.REACT_APP_STEAM_API_KEY + '&steamid=' + qParams[0].name + '&format=json&include_appinfo=1"';
	request(url, function(err, response, body) {
			res.send(body);

	});	
});

app.get('/getprofilebackground', function(req, res) {
	var qParams = [];
	for (var p in req.query) {
		qParams.push({'name':p, 'value':req.query[p]})
	}
var url = 'https://api.steampowered.com/IPlayerService/GetProfileBackground/v1/?key=' + process.env.REACT_APP_STEAM_API_KEY + '&steamid=' + qParams[0].name;
	request(url, function(err, response, body) {
			res.send(body);
	});	
});

app.get('/getplayerinv', function(req, res) {
	var qParams = [];
	for (var p in req.query) {
		qParams.push({'name':p, 'value':req.query[p]})
	}
var url = 'https://steamcommunity.com/inventory/' + qParams[0].name + "/730/2?l=english&count=2000";
	request(url, function(err, response, body) {
			res.send(body);
	});	
});

app.get('/getprice', function(req, res) {
	var qParams = [];
	for (var p in req.query) {
		qParams.push({'name':p, 'value':req.query[p]})
	}
	var market = encodeURIComponent(qParams[0].name);
var url = "https://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name=" + market ;
	request(url, function(err, response, body) {
			res.send(body);
	});	
});



app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});