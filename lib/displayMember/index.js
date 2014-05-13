/**
 * Display Member Page
 *  -- displays the member information,
 *  -- plus the list of movies which the user issued
 */

var express = require("express");
var app = express();
var database = require("../database");
var sql = '';
var cache = require("../redisCache");

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/displayMember/:number', function(req, res) {
	if (req.session.userType !== null) {
		//req.params.number is member id, req.session.userType is userID
		sql = "select membershipId, fName, lName, email, address1, address2, city, state, zip from members where id = " + req.params.number;
		database.connectDB(sql, database.databasePool, function(err, rows) {
			if(err || rows.rows == 0) {
				res.render('../views/error', {error: {"message": "No results found."}});
				return;
			} else {
				var userDetail = rows;
				sql = "select name, banner, category, releaseDate, rentAmount, availableCopies from movies where id in (select distinct movieId " +
				"from orders where memberId = " + req.params.number + ")";
				cache.vlmCache.get("movies", sql, function(err, value) {
					if(value !== null) {
						//console.log("got data from cache");
						//console.log(JSON.stringify(cache.vlmCache.getStats()));
						if(value.rows == 0) {
							res.render('displayMemberNull', {"users": userDetail});
							return;
						} else {
							res.render('displayMember', {"users": userDetail, "movies": value});
							return;
						}					
					} else {				
						database.connectDB(sql, database.databasePool, function(err, rows) {
							if(err) {
								res.render('../views/error', {error: {"message": "No results found."}});
								return;
							} else {
								//console.log(JSON.stringify(userDetail));
								//console.log(JSON.stringify(rows));
								cache.vlmCache.set("movies", sql, rows, function(err, success) {
									if(err || !success) {
										console.log("Unable to set cache.");
									}
									//console.log(JSON.stringify(cache.vlmCache.getStats()));
								});						
								if(rows.rows == 0) {
									res.render('displayMemberNull', {"users": userDetail});
									return;
								} else {
									res.render('displayMember', {"users": userDetail, "movies": rows});
									return;
								}
							}
						});
					}});
			}
		});
	} else {
		res.render('../login/restricted');
	}
});

module.exports = app;