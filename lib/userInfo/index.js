/**
 * user info details
 * membershipId, monthlySubscription Fee if premium member, balance in case of simple member
 * balance mei amount needs to be taken as rent of movies issued
 */

var express = require("express");
var app = express();
var database = require("../database");
var sql = '';
var cache = require("../redisCache");

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/userInfo', function(req, res) {
	if (req.session.userType !== null && (req.session.userType === 1 || req.session.userType === 2)) {
		sql = "select membershipId, if(adminFlag=1, 'Premium Member', 'Simple Member') as memberType," +
		" if(adminFlag=1, subscriptionFee, balance) " +
		"as 'Due Amount' from members where email = '" + req.session.user + "';";
		//console.log(sql);		
		database.connectDB(sql, database.databasePool, function(err, rows) {
			if(err || rows.rows == 0) {
				res.render('../views/error', {error: {"message": "No results found."}});
				return;
			} else {
				//console.log("else block");				
				var billDetails = rows;
				console.log(JSON.stringify(rows));
				sql = "select m.name, m.banner, m.category, m.releaseDate, m.rentAmount," +
				"if(o.isSubmitted=0, 'Submitted', 'Not Submitted') as isSubmitted " +
				"from movies m, orders o where o.movieId = m.id and o.memberId = " + req.session.userId;
				//console.log(sql);
				cache.vlmCache.get("movies", sql, function(err, value) {
					if(value !== null) {
						console.log("got data from cache");
						console.log(JSON.stringify(cache.vlmCache.getStats()));
						if(value.rows == 0) {
							res.render('userInfoNull', {"bill": billDetails});
							return;
						} else {
							res.render('userInfo', {"bill": billDetails, "movies": value});
							return;
						}					
					} else {				
						database.connectDB(sql, database.databasePool, function(err, rows) {
							if(err) {
								res.render('../views/error', {error: {"message": "No results found."}});
								return;
							} else {
								//console.log(JSON.stringify(rows));
								cache.vlmCache.set("movies", sql, rows, function(err, success) {
									if(err || !success) {
										console.log("Unable to set cache.");
									}
									console.log(JSON.stringify(cache.vlmCache.getStats()));
								});							
								if(rows.rows == 0) {
									res.render('userInfoNull', {"bill": billDetails});
									return;
								} else {
									res.render('userInfo', {"bill": billDetails, "movies": rows});
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
	}});

module.exports = app;