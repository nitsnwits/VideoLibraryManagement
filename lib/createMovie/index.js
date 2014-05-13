/**
 * create movie Page
 */
var express = require("express");
var app = express();
var database = require("../database");
var sql = '';
var newUserId = 0;
var usePreparedStatement = false;
var post = null;
var cache = require("../redisCache");
var duplicateCount = 0;


app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/createMovie', function(req, res) {
	
	if (req.session.userType == null) {
		res.render('../login/restricted');
		return;
	}else if(req.session.userType == 1 || req.session.userType == 2 ){
		res.render('authenticationError');
		return;
	}else if(req.session.userType == 0){
	res.render('createMovieForm');
	}
});

function insert(res,duplicateCount,name,banner,category,releaseDate,rentAmount,availableCopies) {
	if(duplicateCount ==1 ){
		res.render('duplicateInsertionError');
		return;
	}else{
		// insert movie using prepared statement
		if(usePreparedStatement){
			
			post  = {name: name, 
				     banner: banner,
				     category: category,
				     releaseDate: releaseDate,
				     rentAmount: rentAmount,
				     availableCopies: availableCopies
				     };
	         sql ="INSERT INTO movies SET ?";
			
		}else{
			// insert movie using ad hoc query
			sql = "insert into movies (name,banner,category,releaseDate,rentAmount,availableCopies) values ('" +
			name + "', '" + banner+ "', '" +
			category + "'," + releaseDate + "," +
			rentAmount+ "," + availableCopies + ")";
		
			
		}
			
		database.connectDBpost(sql,database.databasePool,post,function(err, rows) {
			if (err) {
				res.render('insertionError');
				return;
			} else {
				res.render('success');
				console.log(JSON.stringify(cache.vlmCache.getStats()));
				cache.vlmCache.invalidate("movies", function(err) {
					if(err) {
						throw err;
					}
				});
				console.log(JSON.stringify(cache.vlmCache.getStats()));
				return;
			}
		});
		
	}
}

app.post('/createMovie', function(req, res) {
	
	
		
	
	var name = req.param('Name');
	var banner = req.param('Banner');
	var category = req.param('Category');
	
	var releaseDate =parseInt(req.param('Release Date'));
    var  rentAmount = parseInt(req.param('Rent Amount'));
	var availableCopies = parseInt(req.param('Available Copies'));
	
	//validation for insertion of a movie 
	//Movie Name must not be null
	if(name == "") {
		res.render('../views/error', {error: {"message": "Movie name is null."}});
		return;
	}
	
	//Movie banner must not be null
	if(banner == "") {
		res.render('../views/error', {error: {"message": "Movie banner is null."}});
		return;
	}
	
	//Movie Category must not be null
	if(category == "") {
		res.render('../views/error', {error: {"message": "Movie Category is null."}});
		return;
	}
	
	
		
	// Release Date have numeric value
	if(releaseDate == "" || isNaN(releaseDate)) {
		res.render('../views/error', {error: {"message": "Release Date must be numeric."}});
		return;
	}
	
	
	// Rent Amount have numeric value
	if(rentAmount == "" || isNaN(rentAmount)) {
		res.render('../views/error', {error: {"message": "Rent Amount must be numeric."}});
		return;
	}
	
	// Available copies have numeric value
	if(isNaN(availableCopies)) {
		res.render('../views/error', {error: {"message": "Available Copies must be numeric."}});
		return;
	}
	
	//check is there any other movie with the same name and release date.
	if(usePreparedStatement){
		 post  = [name,releaseDate];
		 sql ="select count(*) as duplicateCount from movies where name= ? and releaseDate= ?";
	}else{
		sql = "select count(*) as duplicateCount from movies where name='"+name+"' and releaseDate="+releaseDate;
		
	}
	
	cache.vlmCache.get("movies", sql, function(err, value) {
		if(value !== null) {
			console.log("got data from cache");
			console.log(JSON.stringify(cache.vlmCache.getStats()));
			duplicateCount = value[0].duplicateCount;
			insert(res,duplicateCount,name,banner,category,releaseDate,rentAmount,availableCopies);
		}else{
			database.connectDBpost(sql,database.databasePool,post,function(err, rows) {
				if (err) {
					res.render('insertionError');
					return;
				} else {
					
					cache.vlmCache.set("movies", sql, rows, function(err, success) {
						if(err || !success) {
							throw err;
						}
					});
					console.log(JSON.stringify(cache.vlmCache.getStats()));
					
					
					duplicateCount = rows[0].duplicateCount;
					insert(res,duplicateCount,name,banner,category,releaseDate,rentAmount,availableCopies);
					
					
				}
			});
		}
	});
	
	
	
	
	
});



module.exports = app;