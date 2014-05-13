/**
 * Login Page
 */
var express = require("express");
var app = express();
var database = require("../database");
var sql = '';

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/login', function(req, res) {
	res.render('loginForm');
	return;
});

app.post('/login', function(req, res) {
	if(req.param('Username') && req.param('Password')) {
		sql = "select email, password, date_format(last_login, '%h:%i %p on %W, %D %M %Y') as last_login, adminFlag, fName, id from members where email='" +
		req.param('Username') + "' and password='" + req.param('Password') + "'";
		database.connectDB(sql, database.databasePool, function(err, rows) {
			if(err || rows.rows == 0) {
				res.render('loginError');
				return;
			} else {
				req.session.user = rows[0]["email"];
				req.session.userType = rows[0]["adminFlag"];
				req.session.userLastLogin = rows[0]["last_login"];
				req.session.userName = rows[0]["fName"];
				req.session.userId = rows[0]["id"];
				//console.log('You are' +req.session.user);
				//console.log('You are' +req.session.userType);

				var lastLogin = rows[0]["last_login"];
				//console.log('login value '+lastLogin);
				var sql = "update members set last_login = current_timestamp\ (\) where email = '" + req.session.user+"'";
				//console.log('Your query: '+ sql);

				database.connectDB(sql, database.databasePool, function(err, rows) {
					if(err) {
						res.render('loginError');
						return;
					} else {
						if(req.session.userType==0){
							res.render('welcomeAdmin', {pageData: {
								"Username": req.param('Username')
								,"LastLogin": lastLogin 
							}
							});
						}
						if(req.session.userType==1 ||req.session.userType==2 ){
							res.render('welcomeUser', {pageData: {
								"Username": req.param('Username')
								,"LastLogin": lastLogin 
							}
							});
						}
					}
				});
			}
		});
	} else {
		res.render('loginError');
		return;
	}
});

module.exports = app;
