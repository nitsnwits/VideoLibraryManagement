/**
 * Update member Page
 * 
 */
var express = require("express");
var app = express();
var database = require("../database");
var validate = require("../validate");
var sql = '';
var newUserId = 0;
var errMsg="";
var cache = require("../redisCache");

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/updateMember', function(req, res) {
	if (req.session.userType == 0 && req.session.user !== null) {
	res.render('updateMember');
	}
	else {
		res.render('../login/restricted');
		return;
	}
});

app.post('/updateMemberSearch', function(req, res) {
	//var state=validate.validateStates(req);

	if (req.session.userType == 0 && req.session.user !== null) {

	// Membership ID must not be null
	if(req.param('Email ID') == "") {
		res.render('../views/error', {error: {"message": "Email ID is null."}});
		return;
	}
	sql = "select count(email) as countmem from members where email ='" +
	req.param('Email ID')+"'";
	database.connectDB(sql, database.databasePool, function(err, rows) {
		if (err) {
			res.render('updateMemberError', {"email" : req.param('Email ID')});
			return;
		} else {
		if(rows[0].countmem==0)
		{
		res.render('updateMemberError', {"email" : req.param('Email ID')});
		return;
		}
		else{
	sql = "select * from members where email ='" +
		req.param('Email ID')+"'";
	console.log("sql: "+sql);
	cache.vlmCache.get("members", sql, function(err, value) {
		if(value !== null) {
			//console.log("got data from cache");
			//console.log(JSON.stringify(cache.vlmCache.getStats()));
			res.render('updateTheMember',{pageData: {
				"membershipId": value[0].membershipId,
				"id": value[0].id,
				"email": value[0].email,
				"fName": value[0].fName,
				"lName": value[0].lName,
				"password": value[0].password,
				"address1": value[0].address1,
				"address2": value[0].address2,
				"city": value[0].city,
				"state": value[0].state,
				"zip": value[0].zip,
				"adminflag": value[0].adminFlag}}
			);
			var pageData={"membershipId": value[0].membershipId,
					"id": value[0].id,
					"email": value[0].email,
					"fName": value[0].fName,
					"lName": value[0].lName,
					"password": value[0].password,
					"address1": value[0].address1,
					"address2": value[0].address2,
					"city": value[0].city,
					"state": value[0].state,
					"zip": value[0].zip,
					"adminflag": value[0].adminFlag};
			var pageDataCopy = JSON.parse(JSON.stringify(pageData));				
		} else {	
	database.connectDB(sql, database.databasePool, function(err, rows) {
		if (err) {
			res.render('updateMemberError');
			return;
		} else {
			console.log("ID "+rows[0].id);	
			//set cache
			cache.vlmCache.set("members", sql, rows, function(err, success) {
				if(err || !success) {
					console.log("Unable to set cache.");
				}
				//console.log(JSON.stringify(cache.vlmCache.getStats()));
			});	
			res.render('updateTheMember',{pageData: {
				"membershipId": rows[0].membershipId,
				"id": rows[0].id,
				"email": rows[0].email,
				"fName": rows[0].fName,
				"lName": rows[0].lName,
				"password": rows[0].password,
				"address1": rows[0].address1,
				"address2": rows[0].address2,
				"city": rows[0].city,
				"state": rows[0].state,
				"zip": rows[0].zip,
				"adminflag": rows[0].adminFlag}}
			);
			var pageData={"membershipId": rows[0].membershipId,
					"id": rows[0].id,
					"email": rows[0].email,
					"fName": rows[0].fName,
					"lName": rows[0].lName,
					"password": rows[0].password,
					"address1": rows[0].address1,
					"address2": rows[0].address2,
					"city": rows[0].city,
					"state": rows[0].state,
					"zip": rows[0].zip,
					"adminflag": rows[0].adminFlag};
			var pageDataCopy = JSON.parse(JSON.stringify(pageData));
			console.log("Pagedata"+pageData);
			console.log("PagedataCopy"+pageDataCopy);
		}
	});
		}});
		}
		}
	});
	}

	else {
		res.render('../login/restricted');
		return;
	}

});
app.post('/updateThisMember', function(req, res) {
	 if (req.session.userType == 0 && req.session.user !== null) {
	var state=validate.validateStates(req);
	
	sql = "select * from members where id=" + req.param('id');
	database.connectDB(sql, database.databasePool, function(err, rows) {
		if (err) {
			res.render('updateError');
			return;
		} else {
			if (rows.length > 0) {

				if (rows[0].membershipId == req.param('Membership ID')
						&& rows[0].email == req.param('Email')
						&& rows[0].fName == req.param('First Name')
						&& rows[0].lName == req.param('Last Name')
						&& rows[0].password == req.param('Password')
						&& rows[0].address1 == req.param('Address1')
						&& rows[0].address2 == req.param('Address2')
						&& rows[0].city == req.param('City')
						&& rows[0].state == req.param('State')
						&& rows[0].zip == req.param('Zipcode')
						&& rows[0].adminFlag == req.param('adminFlag')
				) {
					console.log("There is no update");
					res.render('noUpdate');
					return;
				} else {

					//console.log("email: "+req.param('Email'));
					//console.log("membershipID: "+req.param('Membership ID'));
					sql = "select count(id) as idcount from members where (email ='" +
							req.param('Email')+"' or membershipId='"+req.param('Membership ID')+"') and id<>"+req.param('id');
						//console.log("sql: "+sql);
						database.connectDB(sql, database.databasePool, function(err, rows) {
							if (err) {
								res.render('updateTheMemberError', {pageData: {
									"Error": err}});
								return;
							}
							else if(rows[0].idcount>0)
								{
								console.log("Similar email present? "+rows[0].idcount);	
								res.render('updateTheMemberError', {pageData: {
									"Error": "Duplicate Email id or Membership Id is not allowed"}});
								}
								
								//});
						
						// Check ends
							else if(validate.validateStates(req,res)){
						sql = "update members set " +
							"membershipId='"+req.param('Membership ID')+"',"+
							"email='"+req.param('Email')+"',"+
							"fName='"+req.param('First Name')+"',"+
							"lName='"+req.param('Last Name')+"',"+
							"password='"+req.param('password')+"',"+
							"address1='"+req.param('Address1')+"',"+
							"address2='"+req.param('Address2')+"',"+
							"city='"+req.param('City')+"',"+
							"state='"+req.param('State')+"',"+
							"zip='"+req.param('Zipcode')+"', "+
							"adminFlag="+req.param('adminFlag')+" "+
							"where id="+req.param('id');
					console.log("sql: "+sql);
					database.connectDB(sql, database.databasePool, function(err, rows) {
						if (err) {
							res.render('updateTheMemberError', {pageData: {
								"Email": req.param('Email')}});
						}
							else {
								cache.vlmCache.invalidate("members", function(err) {
									if(err) {
										console.log("Unable to invalidate cache.")
									}
								});								
							res.render('updateMemberSuccessful', {pageData: {
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
						}
				});}
			} 
		}
	});
	 }
	 else {
	 res.render('../login/restricted');
	 return;
	 }
});

module.exports = app;