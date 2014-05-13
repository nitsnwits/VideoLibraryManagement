/**
 * Home Page
 */
var express = require("express");
var app = express();
var database = require("../database");
var sql = '';

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/home', function(req, res) {
	if(req.session.userType !== null && req.session.userType === 0) {
		//0 - admin, 1 - premium, 2-simple
		res.render('homeAdmin', {"name" : req.session.userName, "email": req.session.user, "login": req.session.userLastLogin});
	} else if (req.session.userType !== null && (req.session.userType === 1 || req.session.userType === 2)) {
		res.render('homeUser', {"name" : req.session.userName, "email": req.session.user, "login": req.session.userLastLogin});
	} else {
		res.render('../login/restricted');
		return;
	}
});

module.exports = app;
