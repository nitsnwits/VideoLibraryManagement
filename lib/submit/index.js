/**
 * Submit movie file
 */
var express = require("express");
var app = express();
var database = require("../database");
var cache = require("../redisCache");
var sql = '';
//var orderdata;
//var movieid;

app.set('views', __dirname);
app.set('view engine', 'jade');


app.get('/submitMovie', function (req, res){
	if (req.session.userType === 0) {
	//sql = "SELECT id, memberId, movieId, date_format(issueDate, '%D %M %Y') as issueDate FROM orders WHERE isSubmitted='0'";
	sql = "select m.membershipId as membershipId, mo.name as name, date_format(orders.issueDate, '%D %M %Y') as issueDate, orders.id as id from members m, movies mo, orders where orders.memberId = m.id and orders.movieId = mo.id and orders.isSubmitted=0";
	//console.log(sql);
	cache.vlmCache.get("orders", sql, function(err, value) {
		if(value !== null) {
			var rows=value;
			//console.log("got data from cache");
			//console.log(JSON.stringify(cache.vlmCache.getStats()));
			res.render('submitMovie.jade', {
				results : rows});
			} else {
			console.log("have to set cache");
			database.connectDB(sql, database.databasePool, function(err, rows) {
				if(err) {
					throw err;
				} else {
					//console.log(JSON.stringify(rows));
					cache.vlmCache.set("orders", sql, rows, function(err, success) {
						if(err || !success) {
							throw err;
						}
					});
					//console.log(JSON.stringify(cache.vlmCache.getStats()));
		
					res.render('submitMovie.jade', {results : rows});
		
				}});
			}});
			}else{
				res.render('../login/restricted');
				return;
			}
	});

app.post('/submitMovie', function (req, res){
	if (req.session.userType === 0) {
	sql = "UPDATE orders SET isSubmitted=1, submitDate = curdate() WHERE id='"+req.body.orderid+"'";
	database.connectDB(sql, database.databasePool, function(err, rows) {
		if (err) {
			res.render('submitError', {error : { message : 'Sorry!! Something has gone wrong. :('}});
			return;
			//throw err;
		}else {
			sql = "SELECT movieId FROM orders WHERE id='"+req.body.orderid+"'";
			database.connectDB(sql, database.databasePool, function(err, rows) {
				if(err || rows.rows === 0) {
					res.render('../views/error', {error: {"message": "No results found."}});
					return;
			}else {
				console.log(rows[0].movieId);
				sql = "UPDATE movies SET availableCopies = availableCopies+1 WHERE id='"+rows[0].movieId+"'";
				database.connectDB(sql, database.databasePool, function(err, rows) {
				console.log(sql);
					if (err) {
						//throw err;
					res.render('submitError', {error : { message : 'Sorry!! Something has gone wrong. :('}});
					return;
				}else {
							
				res.render('submitSuccess.jade', {
				results : rows});
								
				}});
			}});
		}
});
}else{
		res.render('../login/restricted');
		return;
	}
	});


module.exports = app;