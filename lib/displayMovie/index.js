/**
 * Display Movie Page
 *  -- displays the movie information,
 *  -- plus the list of users who have issued those movies
 */

var express = require("express");
var app = express();
var database = require("../database");
var sql = '';
var cache = require("../redisCache");

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/displayMovie/:number', function(req, res) {
	if (req.session.userType != null) {
		//req.params.number is Movie id, req.session.user is userID
		sql = "select name as movieName, banner as movieBanner, category as movieCategory, releaseDate as movieReleaseDate, " +
		"rentAmount as movieRentAmount, availableCopies as movieAvailableCopies from movies where id = " + req.params.number;
		database.connectDB(sql, database.databasePool, function(err, rows) {
			if(err || rows.rows == 0) {
				res.render('../views/error', {error: {"message": "No results found."}});
				return;
			} else {
				var movieDetail = rows;
				sql = "select membershipId, fName, email, city from members where id in (select distinct memberId from orders " +
				"where movieId = " + req.params.number + ")";
				cache.vlmCache.get("members", sql, function(err, value) {
					if(value !== null) {
						//console.log("got data from cache");
						//console.log(JSON.stringify(cache.vlmCache.getStats()));
						if(value.rows == 0) {
							res.render('displayMovieNull', {"movies": movieDetail});
							return;
						} else {
							res.render('displayMovie', {"movies": movieDetail, "users": value});
							return;
						}					
					} else {				
						database.connectDB(sql, database.databasePool, function(err, rows) {
							if(err) {
								res.render('../views/error', {error: {"message": "No results found."}});
								return;
							} else {
								//console.log(JSON.stringify(movieDetail));
								//console.log(JSON.stringify(rows));
								cache.vlmCache.set("members", sql, rows, function(err, success) {
									if(err || !success) {
										console.log("Unable to set cache.");
									}
									//console.log(JSON.stringify(cache.vlmCache.getStats()));
								});						
								if(rows.rows == 0) {
									res.render('displayMovieNull', {"movies": movieDetail});
									return;
								} else {
									res.render('displayMovie', {"movies": movieDetail, "users": rows});
									return;
								}
							}
						});
					}});
			}
		});

	} else {
		res.render('../login/restricted');
		return;
	}
});

module.exports = app;