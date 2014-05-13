/**
 * Logout Page
 */
var express = require("express");
var app = express();
var database = require("../database");
var sql = '';
var i;
var cache = require("../redisCache");

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/generateBill', function(req, res) {
	if (req.session.userType == 0 && req.session.user !== null) {
		sql = "select m.membershipId,if(m.adminFlag=1, 'Premier','Simple') as MemmbershipType,  concat(m.fName,' ',m.lName) as name, count(o.movieId) as numberofmovies, date_format(max(DATE_ADD(issueDate, INTERVAL 30 DAY)),'%W %D %M %Y') as duedate,if(m.adminFlag=1, subscriptionFee,balance) as Totalamt from videolibrarymanagementdb.members m, videolibrarymanagementdb.orders o where m.Id=o.memberId and MONTH(o.issueDate)=MONTH(NOW()) and YEAR(o.issueDate)=YEAR(NOW())group by m.Id";
		cache.vlmCache.get("movies", sql, function(err, value) {
			if(value !== null) {
				rows1 = value;
				//console.log("got data from cache");
				//console.log(JSON.stringify(cache.vlmCache.getStats()));
				res.render('generateBillResult.jade', {BillData : rows1});
			} else {
				console.log("have to set cache");
		database.connectDB(sql, database.databasePool, function(err, rows) {
			if (err) {
				res.render('../views/error', {error: {"message": "No results found."}});
				return;
			}
			else
			{
			if(rows.rows !== 0)
				{
				//res.render('generateBillError', {error : { message : 'Sorry!! No movies have been issued yet'}});
				//}
			//else
				//console.log(JSON.stringify(rows));
				cache.vlmCache.set("movies", sql, rows, function(err, success) {
					if(err || !success) {
						throw err;
					}
				});
				//console.log(JSON.stringify(cache.vlmCache.getStats()));
				//console.log(JSON.stringify(rows));
				res.render('generateBillResult',{BillData: rows}
				);
				}
			else
				{
				res.render('generateBillError.jade', {message : 'Bill Cannot be generated. No movies have been issued yet'});
				}
			}
		});
	}});
	}
	else {
		res.render('../login/restricted');
		return;
	}
});
app.get('/viewBalance', function(req, res) {
	sql = "select balance from videolibrarymanagementdb.subscription where memberId= ";
	//console.log("sql: "+sql);
	database.connectDB(sql, database.databasePool, function(err, rows) {
		if (err) {
			res.render('../views/error', {error: {"message": "No results found."}});
			return;
		}
		else if(rows[0].idcount>0)
		{
			//console.log("Similar email present? "+rows[0].idcount);
			res.render('generateBillError', {pageData: {
				"Error": "Duplicate Email id not allowed"}});
		}

	});
});

module.exports = app;
