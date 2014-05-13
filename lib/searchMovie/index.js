/**
 * Search Movie Page
 *  -- Allows the user to search a movie
 *  -- based on attributes as well as a full text search
 */

var express = require("express");
var app = express();
var database = require("../database");
var sql = '';
var cache = require("../redisCache");

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/searchMovie', function(req, res) {
	if (req.session.userType !== null) {
		res.render('searchMovieForm');
	} else {
		res.render('../login/restricted');
		return;
	}
});

app.post('/searchMovie', function(req, res) {
	if(req.session.userType !==  null) {
		//req.session.userType is user Type
		/* Form data details:
		 * req.param('fullText') -- search everything
		 * req.param('movieName')
		req.param('movieBanner')
		req.param('movieCategory')
		req.param('movieRentAmount')
		req.param('movieAvailableCopies')
		 */
		// If search for any keyword is made, run this sql and override the other portion of the code
		var baseSql = "select name, banner, category, releaseDate, rentAmount, availableCopies, id from movies where ";
		if (req.param('fullText') !== "") {
			sql = baseSql + "match(name, banner, category) against(+'" + req.param('fullText') + "*' IN BOOLEAN MODE)";
		} else {
			//SQL for specific keywords, one movie name, or banner, or category, else, list all movies;
			//sql = baseSql + "match(name, banner, category) against(+'";
			if (req.param('movieName') !== "") {
				sql = baseSql + "match(name) against(+'" + req.param('movieName') + "')";
			} else if (req.param('movieBanner') !== "") {
				sql = baseSql + "match(banner) against(+'" + req.param('movieBanner') + "')";
			} else if (req.param('movieCategory')) {
				sql = baseSql + "match(category) against(+'" + req.param('movieCategory') + "')";
			} else if (req.param('movieRentAmount')) {
				sql = baseSql + "rentAmount " + req.param('movieRentAmount');
			}  else if (req.param('movieAvailableCopies')) {
				sql = baseSql + "availableCopies " + req.param('movieAvailableCopies');
			} else {
				//sql = "select name, banner, category, releaseDate, rentAmount, availableCopies from movies";
				res.render('searchMovieNull');
				return;
			}
		}
		//console.log(sql);
		cache.vlmCache.get("movies", sql, function(err, value) {
			if(value !== null) {
				//console.log("got data from cache");
				//console.log(JSON.stringify(cache.vlmCache.getStats()));
				if(value.rows === 0) {
					res.render('searchMovie', {"movies": 0});
				} else {
					res.render('searchMovie', {"movies": value});
				}					
			} else {		
				database.connectDB(sql, database.databasePool, function(err, rows) {
					if(err) {
						throw err;
					} else {
						//console.log(rows.rows); == undefined when results are returned, 0 when no results are returned
						//Set cache before rendering page
						cache.vlmCache.set("movies", sql, rows, function(err, success) {
							if(err || !success) {
								console.log("Unable to set cache.");
							}
							//console.log(JSON.stringify(cache.vlmCache.getStats()));
						});
						if(rows.rows === 0) {
							res.render('searchMovie', {"movies": 0});
						} else {
							res.render('searchMovie', {"movies": rows});
						}
					}
				});
			}});
	} else {
		res.render('../login/restricted');
		return;
	}
});

module.exports = app;