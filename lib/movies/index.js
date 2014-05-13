/**
 * getAllMovies file
 */
var express = require("express");
var app = express();
var database = require("../database");
var cache = require("../redisCache");
var sql = '';

app.set('views', __dirname);
app.set('view engine', 'jade');
var catas;
var rows1;

app.get('/getAllMovies', function (req, res){
	if (req.session.userType !== null && (req.session.userType === 0 || req.session.userType === 1 || req.session.userType === 2)) {
		sql = 'SELECT DISTINCT category FROM movies ORDER BY category ASC';



		cache.vlmCache.get("movies", sql, function(err, value) {
			if(value !== null) {
				rows1 = value;
				console.log("got data from cache");
				console.log(JSON.stringify(cache.vlmCache.getStats()));
				res.render('allMovies.jade', {catas : rows1});
			} else {
				console.log("have to set cache");

				database.connectDB(sql, database.databasePool, function(err, rows) {
					rows1=rows;
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
						res.render('allMovies.jade', {catas : rows1});
					}});

				}});
		}else{
			res.render('../login/restricted');
		}
	});


		app.post('/getAllMovies', function (req, res){
			if (req.session.userType !== null && (req.session.userType === 0 || req.session.userType === 1 || req.session.userType === 2)) {
				console.log(req.body.cat);
				if (req.body.cat === "All")
				{sql = 'select * from movies';}
				else{
					sql = 'select * from movies where category=\'' + req.body.cat + '\'';}
				database.connectDB(sql, database.databasePool, function(err, rows) {
					if (err) {
						throw err;
					}else {
						res.render('getAllMovies.jade', {results : rows, catas : rows1});
					}});
			}else{
				res.render('../login/restricted');
			}
		});

		module.exports = app;