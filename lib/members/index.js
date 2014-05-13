/**
 * Search members
 */
var express = require("express");
var app = express();
var database = require("../database");
var cache = require("../redisCache");
var sql = '';
var utype;

app.set('views', __dirname);
app.set('view engine', 'jade');


app.post('/getAllMembers', function (req, res)
		{
	if (req.session.userType !== null && (req.session.userType === 0 || req.session.userType === 1 || req.session.userType === 2)) {
		//console.log(req.body.member);
		if (req.body.member !== '0')
		{
			sql = 'select id,membershipId,fName,lName from members where adminFlag=\'' + req.body.member + '\'';
		}else{
			sql = "select id,membershipId,fName,lName from members where adminFlag != '0'";
		}
		cache.vlmCache.get("members", sql, function(err, value) {
			if(value !== null) {
				var rows=value;
				//console.log("got data from cache");
				//console.log(JSON.stringify(cache.vlmCache.getStats()));
				if(req.body.member === '1'){
					res.render('getAllMember.jade', {results : rows, user : {name : "Premium"}});
					}
				else if(req.body.member === '2'){
					res.render('getAllMember.jade', {results : rows, user : {name : "Simple"}});
					}
				else if(req.body.member === '0'){
					res.render('getAllMember.jade', {results : rows, user : {name : "All"}});
					}
			} else {
				console.log("have to set cache");
				database.connectDB(sql, database.databasePool, function(err, rows) {
					//console.log(sql);
					if(err) {
						throw err;
					} else {
						//console.log(JSON.stringify(rows));
						cache.vlmCache.set("members", sql, rows, function(err, success) {
							if(err || !success) {
								throw err;
							}
						});
						//console.log(JSON.stringify(cache.vlmCache.getStats()));
						if (rows !== null){
							if(req.body.member === '1'){
								res.render('getAllMember.jade', {results : rows, user : {name : "Premium"}});}
							else if(req.body.member === '2'){
								res.render('getAllMember.jade', {results : rows, user : {name : "Simple"}});}
							else if(req.body.member === '0'){
								res.render('getAllMember.jade', {results : rows, user : {name : "All"}});}
						}else{
							res.render('getAllMembersError', {error : { message : 'Sorry!! No Members under the selected option'}});
						}

					}});

			}});
		} else {
				res.render('../login/restricted');
			}
	});



		app.get('/getAllMembers', function (req, res){
			if (req.session.userType !== null && (req.session.userType === 0 || req.session.userType === 1 || req.session.userType === 2)) {
				res.render('Allmembers');
			} else {
				res.render('../login/restricted');
			}
		});

		module.exports = app;