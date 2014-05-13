/**
 * Signup Page
 */
var express = require("express");
var app = express();
var database = require("../database");
var  validate= require("../validate");
var sql = '';
var newUserId = 0;
var subscriptionFee=0;

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/signup', function(req, res) {
	res.render('signupForm');
});

app.post('/signup', function(req, res) {
	
	var value= req.body.isPremium;
	console.log('you have selected: '+ value);
	
	console.log('after method');
	
	console.log('State'+validate.validateStates(req));
	console.log('password'+validate.validatePassword(req,res));
	
	var state=validate.validateStates(req);
	var pwd=validate.validatePassword(req,res);
	
	sql="SELECT count(*) as c1,(select count(*) as c2 from members where email='" + req.param('Email')+"')as c2 from members where membershipId='" + req.param('Membership ID')+"'";  
	console.log("sql: "+sql);
	
	database.connectDB(sql, database.databasePool, function(err, rows) {
		console.log('row value'+rows[0]["c1"]+ rows[0]["c2"]);
		
       if(rows[0]["c1"]===0 && rows[0]["c2"]===0 ) 
       {         
	
	console.log('validate'+ validate.validateMemberID(req,res));
	if(validate.validateStates(req,res) && validate.validatePassword(req,res)){
		console.log("User type: "+req.param('isPremium'));
		if(req.param('isPremium')==1){
		subscriptionFee=10;
		}
				sql = "insert into members (membershipId, email, fName, lName, password, " +
		"address1, address2, city, state, zip, adminFlag,subscriptionFee) values ('" +
		req.param('Membership ID') + "', '" + req.param('Email') + "', '" +
		req.param('First Name') + "', '" + req.param('Last Name') + "', '" +
		req.param('Password') + "', '" + req.param('Address1') + "', '" +
		req.param('Address2') + "', '" + req.param('City') + "', '" +
		req.param('State') + "', '" + req.param('Zipcode') + "', '"+req.param('isPremium') +"',"+subscriptionFee+")";
	console.log("sql "+sql);
	database.connectDB(sql, database.databasePool, function(err, rows) {
		if (err) {
			console.log('Error occured');
			res.render('signupError');
			return;
		} else {
			res.render('newUserWelcome', {pageData: {
				"Email": req.param('Email'),
				"Password": req.param('Password')}});
				}
			});
		}
	else{
		console.log('Invalid State');
		if(!state)
		{
			res.render('../views/error', {error: {"message": "State is not valid!! Please Enter a valid State"}});
			return;
		}
		
		if(!pwd)
		{
			res.render('../views/error', {error: {"message": "Password does not match!!"}});
			return;
		}
		}
       }else  {
    	   var errMsg="An error occured!!";
    	   if(rows[0]["c1"]===1)
           {
    		   errMsg=errMsg+"Member ID is duplicate.\n";
           }
    	   if(rows[0]["c2"]===1)
           {
    		   errMsg=errMsg+"Email ID is duplicate .\n";
           }
           res.render('signupError', {error: {"message": errMsg}});
           return;
 		}
	});
});
module.exports = app;