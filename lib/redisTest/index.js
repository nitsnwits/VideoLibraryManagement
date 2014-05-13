/**
 * Test redis cache
 */

var express = require("express");
var app = express();
var database = require("../database");
var sql = '';
var cache = require("../redisCache");

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/redisTest', function(req, res) {
	sql = "select * from movies where id < 3";
	cache.vlmCache.get("movies", sql, function(err, value) {
		if(value !== null) {
			console.log("got data from cache");
			console.log(JSON.stringify(cache.vlmCache.getStats()));
			res.send(JSON.stringify(value));
		} else {
			console.log("have to set cache");
			database.connectDB(sql, database.databasePool, function(err, rows) {
				if(err) {
					throw err;
				} else {
					//console.log(JSON.stringify(rows));
					cache.vlmCache.set("movies", sql, rows, function(err, success) {
						if(err || !success) {
							throw err;
						}
					});
					console.log(JSON.stringify(cache.vlmCache.getStats()));
					res.send(JSON.stringify(rows));
				}
			});
		}
	});
});

app.get('/redisTest2', function(req, res) {
	sql = "select * from members";
	cache.vlmCache.get("members", sql, function(err, value) {
		if(value !== null) {
			console.log("got data from cache");
			console.log(JSON.stringify(cache.vlmCache.getStats()));
			res.send(JSON.stringify(value));
		} else {
			console.log("have to set cache");
			database.connectDB(sql, database.databasePool, function(err, rows) {
				if(err) {
					throw err;
				} else {
					//console.log(JSON.stringify(rows));
					cache.vlmCache.set("members", sql, rows, function(err, success) {
						if(err || !success) {
							throw err;
						}
					});
					console.log(JSON.stringify(cache.vlmCache.getStats()));
					res.send(JSON.stringify(rows));
				}
			});
		}
	});
});

app.get('/redisTest3', function(req, res) {
	sql = "select * from members";
	console.log(JSON.stringify(cache.vlmCache.getStats()));
	cache.vlmCache.invalidate("members", function(err) {
		if(err) {
			throw err;
		}
	});
	console.log(JSON.stringify(cache.vlmCache.getStats()));
	res.send("..get the hell to console.");
});




module.exports = app;