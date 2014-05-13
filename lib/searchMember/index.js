/**
 * Search Member Page
 *  -- Allows the user to search a movie
 *  -- based on attributes as well as a full text search
 */

var express = require("express");
var app = express();
var database = require("../database");
var validate = require("../validate");
var sql = '';
var cache = require("../redisCache");


app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/searchMember', function(req, res) {
	if (req.session.userType == 0 && req.session.user !== null) {
		res.render('searchMemberForm');
	} else {
		res.render('../login/restricted');
		return;
	}
});

app.post('/searchMember', function(req, res) {
	if(req.session.userType == 0 && req.session.user !== null) {
		//console.log("state: "+req.param('state'));
		var state=validate.validateStates(req);
		//console.log("state: "+state);
		if(validate.validateStates(req)){
			// If search for any keyword is made, run this sql and override the other portion of the code
			var baseSql = "select membershipId, email, fname, lname, address1, address2, city, state, zip, id from members where ";
			if (req.param('fullText') !== "") {
				sql = baseSql + "match(membershipId,email,fname,lname,address1,address2,city,state,zip) against(+'" + req.param('fullText') + "*' IN BOOLEAN MODE)";
			} else {
				//SQL for specific keywords, one member id, member name, or email, or address, city, state zip else, list all movies;
				//sql = baseSql + "match(membershipId,email,fname,lname,address1,address2,city,state,zip) against(+'";
				if (req.param('membershipId') !== "") {
					sql = baseSql + "membershipId = '" + req.param('membershipId') + "'";
				} else if (req.param('email') !== "") {
					sql = baseSql + "email = '" + req.param('email') + "'";
				} else if (req.param('fName') !== "") {
					sql = baseSql + "match(fname) against(+'" + req.param('fName') + "')";
				} else if (req.param('lName') !== "") {
					sql = baseSql + "match(lname) against(+'" + req.param('lName') + "')";
				}  else if (req.param('address1') !== "") {
					sql = baseSql + "match(address1) against(+'" + req.param('address1') + "')";
				}  else if (req.param('address2') !== "") {
					sql = baseSql + "match(address2) against(+'" + req.param('address2') + "')";
				}  else if (req.param('city') !== "") {
					sql = baseSql + "match(city) against(+'" + req.param('city') + "')";
				}  else if (req.param('State') !== "") {
					sql = baseSql + "match(state) against(+'" + req.param('State') + "')";
				}  else if (req.param('zip') !== "") {
					sql = baseSql + "match(zip) against(+'" + req.param('zip') + "')";
				} else {
					//sql = "select membershipId, email, fname, lname, address1, address2, city, state, zip from members";
					res.render('searchMemberNull');
					return;
				}
			}
			//console.log(sql);
			//var state=validate.validateStates(req);
			//console.log("State: "+req.param('State'));
			//if(validate.validateStates(req,res)){	
			//console.log("State2: "+req.param('state'));
			cache.vlmCache.get("members", sql, function(err, value) {
				if(value !== null) {
					console.log("got data from cache");
					console.log(JSON.stringify(cache.vlmCache.getStats()));
					if(value.rows === 0) {
						res.render('searchMember', {"member": 0});
					} else {
						res.render('searchMember', {"member": value});
					}					
				} else {
					database.connectDB(sql, database.databasePool, function(err, rows) {
						if(err) {
							res.render('../views/error', {error: {"message": "No results found."}});
							return;
						} else {
							//console.log(rows.rows); == undefined when results are returned, 0 when no results are returned
							//Set cache before rendering page
							cache.vlmCache.set("members", sql, rows, function(err, success) {
								if(err || !success) {
									console.log("Unable to set cache.");
								}
								console.log(JSON.stringify(cache.vlmCache.getStats()));
							});							
							if(rows.rows === 0) {
								res.render('searchMember', {"member": 0});
							} else {
								res.render('searchMember', {"member": rows});
							}
						}
					});
				}
			});
		} else {
			console.log('Invalid State');
			if(!state)
			{
				res.render('../views/error', {error: {"message": "State is not valid!! Please Enter a valid State"}});
				return;
			}
		}
	} else {
		res.render('../login/restricted');
		return;
	}
});

module.exports = app;