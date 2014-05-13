/**
 * Delete Member file
 */
var express = require("express");
var app = express();
var database = require("../database");
var sql = '';

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/deleteMember', function(req, res) {
	if(req.session.user !== null && req.session.userType===0 ) {
		res.render('deleteMemberForm');	
	} else {
		res.render('../login/restricted');
		return;
	}
	
});
app.post('/deleteMember', function(req, res) {
	
	if(req.session.userType===0 && req.session.user!==null ){
		sql="SELECT count(*) as del_mem from members where membershipId='" + req.param('Membership ID')+"'";
		
	database.connectDB(sql, database.databasePool, function(err, rows) {
		//console.log('row value'+rows[0]["del_mem"]);
		var noMember= rows[0]["del_mem"];
		//console.log('before delete query');
		if(noMember>=1)
		{
			if(req.param('Membership ID') !== '000-00-0000'){
		sql = "delete from members where membershipID= '" +
			req.param('Membership ID') + "'";
		//console.log('sql: '+sql);
		
		database.connectDB(sql, database.databasePool, function(err, rows) {
			if (err) {
				res.render('deleteMemberError');
				return;
			} else {
				res.render('deleteMember');
			}
		});
		}else{
			res.render('deleteMemberError', {error: {"message": "Sorry you cannot delete admin!"}});
		}
			}else{
			res.render('deleteMemberError', {error: {"message": "This member Id doesnot exists in the database. Please enter existing member Id to delete"}});
			return;
		}
	});
	}else{
		//console.log('you are'+req.session.user);
		//console.log('you are of type: '+req.session.userType);
		res.render('../login/restricted');
		return;
	}
});

module.exports = app;