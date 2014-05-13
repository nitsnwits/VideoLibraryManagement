/**
 * update movie Page
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
var post = null;


function update(res,rows,movieId,name,banner,category,releaseDate,rentAmount,availableCopies) {
	

		
		// Check for change
		if (rows[0].name == name && rows[0].banner == banner
				&& rows[0].category == category
				&& rows[0].releaseDate == releaseDate
				&& rows[0].rentAmount == rentAmount
				&& rows[0].availableCopies == availableCopies) {
			console.log("There is no update");
			res.render('noUpdate');
			//return;
		} else {
			
			if(usePreparedStatement){
				
				post  = [name,banner,category,releaseDate,rentAmount,availableCopies,movieId];
				
		        sql ="UPDATE movies SET name=?,banner=?,category=?,releaseDate=?,rentAmount=?,availableCopies=? where id=?";
			}else{
				sql = "update movies set name='" + name + "',banner='"
				+ banner + "',category='" + category
				+ "',releaseDate=" + releaseDate + ",rentAmount="
				+ rentAmount + ",availableCopies="
				+ availableCopies + " where id=" + movieId;
			}

			

			database.connectDBpost(sql, database.databasePool,post, function(
					err, rows) {
				if (err) {
					res.render('updateError');
					return;
				} else {
					cache.vlmCache.invalidate("movies", function(err) {
						if(err) {
							throw err;
						}
					});
					console.log(JSON.stringify(cache.vlmCache.getStats()));
					
					res.render('success');
				}
			});
		}
	
}

app.get('/updateMovie/:movieId', function(req, res) {

	
	if (req.session.userType === null) {
		res.render('../login/restricted');
	}else if(req.session.userType === 1 || req.session.userType === 2 ){
		res.render('authenticationError');
	}else if(req.session.userType === 0){
	var movieId = req.params.movieId;

	if (movieId === "" || isNaN(movieId)) {
		res.render('../views/error', {
			error : {
				"message" : "Movie Id must be numeric."
			}
		});
		return;
	}

	if(usePreparedStatement){
		post  = [movieId];
        sql ="select * from movies where id= ?";
	}else{
		sql = "select * from movies where id=" + movieId;
	}
	
	
	cache.vlmCache.get("movies", sql, function(err, value) {
		if(value !== null) {
			console.log("got data from cache");
			console.log(JSON.stringify(cache.vlmCache.getStats()));

             //if(value.lengh>0){
            	 
            	var name = value[0].name;
 				var banner = value[0].banner;
 				var category = value[0].category;
 				var releaseDate = value[0].releaseDate;
 				var rentAmount = value[0].rentAmount;
 				var availableCopies = value[0].availableCopies;

 				res.render('updateMovieForm', {
 					pageData : {
 						"Name" : name,
 						"Banner" : banner,
 						"Category" : category,
 						"ReleaseDate" : releaseDate,
 						"RentAmount" : rentAmount,
 						"AvailableCopies" : availableCopies,
 						"Id" : movieId

 					}
 				});
            	 
//             }else{
//            	 res.render('noMovieError', {
// 					pageData : {
// 						"movieId" : movieId
// 					}
// 				});
//             }
			
		} else {
			
		

	database.connectDBpost(sql, database.databasePool,post, function(err, rows) {
		if (err) {
			res.render('updateError');
			return;
		} else {

			if (rows.length > 0) {
				
				cache.vlmCache.set("movies", sql, rows, function(err, success) {
					if(err || !success) {
						throw err;
					}
				});
				console.log(JSON.stringify(cache.vlmCache.getStats()));
				
				var name = rows[0].name;
				var banner = rows[0].banner;
				var category = rows[0].category;
				var releaseDate = rows[0].releaseDate;
				var rentAmount = rows[0].rentAmount;
				var availableCopies = rows[0].availableCopies;

				res.render('updateMovieForm', {
					pageData : {
						"Name" : name,
						"Banner" : banner,
						"Category" : category,
						"ReleaseDate" : releaseDate,
						"RentAmount" : rentAmount,
						"AvailableCopies" : availableCopies,
						"Id" : movieId

					}
				});
			} else {

				res.render('noMovieError', {
					pageData : {
						"movieId" : movieId
					}
				});
				return;
			}
		}
	});
	
	
		}
	});
	
	
	}
});




app.post('/updateMovie', function(req, res) {

	var name = req.param('Name');
	var banner = req.param('Banner');
	var category = req.param('Category');

	var releaseDate = parseInt(req.param('Release Date'));
	var rentAmount = req.param('Rent Amount');
	var availableCopies = parseInt(req.param('Available Copies'));
	var movieId = req.param('Movie Id');
	
	

	// Error Checking and validation for signup
	// Movie Name must not be null
	if (name === "") {
		res.render('../views/error', {
			error : {
				"message" : "Movie name is null."
			}
		});
		return;
	}

	// Movie banner must not be null
	if (banner === "") {
		res.render('../views/error', {
			error : {
				"message" : "Movie banner is null."
			}
		});
		return;
	}

	// Movie Category must not be null
	if (category === "") {
		res.render('../views/error', {
			error : {
				"message" : "Movie Category is null."
			}
		});
		return;
	}

	// Release Date have numeric value
	if (releaseDate === "" || isNaN(releaseDate)) {
		res.render('../views/error', {
			error : {
				"message" : "Release Date must be numeric."
			}
		});
		return;
	}

	// Rent Amount have numeric value
	if (rentAmount === "" || isNaN(rentAmount)) {
		res.render('../views/error', {
			error : {
				"message" : "Rent Amount must be numeric."
			}
		});
		return;
	}

	// Available copies have numeric value
	if (isNaN(availableCopies)) {
		res.render('../views/error', {
			error : {
				"message" : "Available Copies must be numeric."
			}
		});
		return;
	}

	if(usePreparedStatement){
		post  = [movieId];
        sql ="select * from movies where id= ?";
	}else{
		sql = "select * from movies where id=" + movieId;
	}
	
	cache.vlmCache.get("movies", sql, function(err, value) {
		if(value !== null) {
			console.log("got data from cache");
			console.log(JSON.stringify(cache.vlmCache.getStats()));
			update(res,value,movieId,name,banner,category,releaseDate,rentAmount,availableCopies);
		} else {
			
		}
	});
	
	database.connectDBpost(sql, database.databasePool,post, function(err, rows) {
		if (err) {
			res.render('updateError');
			return;
		} else {
			
			cache.vlmCache.set("movies", sql, rows, function(err, success) {
				if(err || !success) {
					throw err;
				}
			});
			console.log(JSON.stringify(cache.vlmCache.getStats()));
			update(res,rows,movieId,name,banner,category,releaseDate,rentAmount,availableCopies);
		}
	});

});


var catas;
var rows1;
app.get('/ugetAllMovies', function(req, res) {
	if (req.session.userType !== null) {
		sql = 'SELECT DISTINCT category FROM movies ORDER BY category ASC';
		
		cache.vlmCache.get("movies", sql, function(err, value) {
			if(value !== null) {
				rows1 = value;
				console.log("got data from cache");
				console.log(JSON.stringify(cache.vlmCache.getStats()));
				res.render('uallMovies.jade', {
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
						res.render('uallMovies.jade', {
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

app.post('/ugetAllMovies', function(req, res) {
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
				res.render('ugetAllMovies.jade', {
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
						
						res.render('ugetAllMovies.jade', {
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
