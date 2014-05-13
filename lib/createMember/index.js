/**
 * Create Member Page
 */
var express = require("express");
var app = express();
var database = require("../database");
var  validate= require("../validate");
var sql = '';
var newUserId = 0;

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/createMember', function(req, res) {
	if(req.session.user !== null && req.session.userType===0 ) {
		res.render('createMemberForm');
	} else {
		res.render('../login/restricted');
		return;
	}
});

app.post('/createMember', function(req, res) {

	var value= req.body.isPremium;
	//console.log('you have selected: '+ value);
	var state=validate.validateStates(req);
	var pwd=validate.validatePassword(req,res);

	sql="SELECT count(*) as c1,(select count(*) as c2 from members where email='" + req.param('Email')+"')as c2 from members where membershipId='" + req.param('Membership ID')+"'";  
	//console.log("sql: "+sql);

	database.connectDB(sql, database.databasePool, function(err, rows) {
		//console.log('row value'+rows[0]["c1"]+ rows[0]["c2"]);

		if(rows[0]["c1"]===0 && rows[0]["c2"]===0 ) 
		{         
			//console.log('value of sql'+ sql);

			if(validate.validateStates(req,res) && validate.validatePassword(req,res)){
				sql = "insert into members (membershipId, email, fName, lName, password, " +
				"address1, address2, city, state, zip, adminFlag) values ('" +
				req.param('Membership ID') + "', '" + req.param('Email') + "', '" +
				req.param('First Name') + "', '" + req.param('Last Name') + "', '" +
				req.param('Password') + "', '" + req.param('Address1') + "', '" +
				req.param('Address2') + "', '" + req.param('City') + "', '" +
				req.param('State') + "', '" + req.param('Zipcode') + "', '"+req.param('isPremium') +"')";
				database.connectDB(sql, database.databasePool, function(err, rows) {
					if (err) {
						res.render('createMemberError');
						return;
					} else {
						res.render('createMember');
					}
				});
			}
			else{
				//console.log('Invalid State');
				if(!state)
				{
					res.render('createMemberError', {error: {"message": "State is not valid!! Please Enter a valid State"}});
					return;
				}
				if(!pwd)
				{
					res.render('createMemberError', {error: {"message": "Password does not match!!"}});
					return;
				}
			}
		}
		else  {
			var errMsg="An error occured!!";
			if(rows[0]["c1"]===1)
			{
				errMsg=errMsg+"Member ID is duplicate.\n";
			}
			if(rows[0]["c2"]===1)
			{
				errMsg=errMsg+"Email ID is duplicate .\n";
			}
			res.render('createMemberError', {error: {"message": errMsg}});
			return;
		}
	});
});
module.exports = app;