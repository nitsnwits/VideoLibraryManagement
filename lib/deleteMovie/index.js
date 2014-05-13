/**
 * delete movie Page
 */
var express = require("express");
var app = express();
var database = require("../database");
var sql = '';
var newUserId = 0;
var usePreparedStatement = false;
var cache = require("../redisCache");

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/deleteMovie/:movieId', function(req, res) {

	if (req.session.userType === null) {
		res.render('../login/restricted');
		return;
	} else if (req.session.userType === 1 || req.session.userType === 2) {
		res.render('authenticationError');
		return;
	} else if (req.session.userType === 0) {
		var movieId = req.params.movieId;

		// delete movies
		if (usePreparedStatement) {
			post = [ movieId ];
			sql = "delete from movies where id=?";
		} else {
			sql = "delete from movies where id=" + movieId;
		}

		database.connectDBpost(sql, database.databasePool, post, function(err,
				rows) {
			if (err) {
				res.render('deleteError');
				return;
			} else {
				cache.vlmCache.invalidate("movies", function(err) {
					if (err) {
						throw err;
					}
				});
				console.log(JSON.stringify(cache.vlmCache.getStats()));
				res.render('success');
			}
		});
	}
});

var catas;
var rows1;
app.get('/dgetAllMovies', function(req, res) {
	if (req.session.userType !== null) {
		sql = 'SELECT DISTINCT category FROM movies ORDER BY category ASC';
		
		cache.vlmCache.get("movies", sql, function(err, value) {
			if(value !== null) {
				rows1 = value;
				console.log("got data from cache");
				console.log(JSON.stringify(cache.vlmCache.getStats()));
				res.render('dallMovies.jade', {
					catas : value
				});
			} else {
				database.connectDB(sql, database.databasePool, function(err, rows) {
					rows1 = rows;
					if (err) {
						res.render('../views/error', {
							error : {
								"message" : "No results found."
							}
						});
						return;
					} else {
						
						cache.vlmCache.set("movies", sql, rows, function(err, success) {
							if(err || !success) {
								throw err;
							}
						});
						console.log(JSON.stringify(cache.vlmCache.getStats()));
						res.render('dallMovies.jade', {
							catas : rows1
						});

					}
				});
			}
		});
		
	} else {
		res.render('../login/restricted');
		return;
	}
});

app.post('/dgetAllMovies', function(req, res) {
	if (req.session.userType !== null) {
		console.log(req.body.cat);
		if (req.body.cat === "All") {
			sql = 'select * from movies';
		} else {
			sql = 'select * from movies where category=\'' + req.body.cat
					+ '\'';
		}
		
		cache.vlmCache.get("movies", sql, function(err, value) {
			if(value !== null) {
				console.log("got data from cache");
				console.log(JSON.stringify(cache.vlmCache.getStats()));
				res.render('dgetAllMovies.jade', {
					results : value,
					catas : rows1
				});
			} else {
				
				database.connectDB(sql, database.databasePool, function(err, rows) {
					if (err) {
						res.render('../views/error', {
							error : {
								"message" : "No results found."
							}
						});
						return;
					} else {
						cache.vlmCache.set("movies", sql, rows, function(err, success) {
							if(err || !success) {
								throw err;
							}
						});
						console.log(JSON.stringify(cache.vlmCache.getStats()));
						
						res.render('dgetAllMovies.jade', {
							results : rows,
							catas : rows1
						});
					}
				});
				
			}
			
		});
		
	} else {
		res.render('../login/restricted');
		return;
	}
});

module.exports = app;