/**
 * Logout Page
 */
var express = require("express");
var app = express();

app.set('views', __dirname);
app.set('view engine', 'jade');

app.post('/logout', function(req, res) {
	//get req.param('Username') and req.param('Password') from form data
	req.session.destroy(function(){});
	res.render('logout');
});

module.exports = app;
