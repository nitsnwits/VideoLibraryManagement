/**
 * Video Library Management System Main application file
 */

var express = require("express"),
	app = express();

//import cache, flush cache on every server startup,
//initialization takes time, but cache is renewed on server startup
var cache = require("./lib/redisCache");

//Define routing variables
var login = require("./lib/login"),
	signup = require("./lib/signup"),
	database = require("./lib/database"),
	logout = require("./lib/logout"),
	home = require("./lib/home"),
	displayMovie = require("./lib/displayMovie"),
	displayMember = require("./lib/displayMember"),
	searchMovie = require("./lib/searchMovie"),
	createMovie = require("./lib/createMovie"),
	updateMovie = require("./lib/updateMovie"),
	deleteMovie = require("./lib/deleteMovie"),
	issue = require("./lib/issue"),
	members = require("./lib/members"),
	submit = require("./lib/submit"),
	movies = require("./lib/movies"),
	createMember = require("./lib/createMember"),
	deleteMember = require("./lib/deleteMember"),
	updateMember = require("./lib/updateMember"),
	generateBill = require("./lib/generateBill"),
	searchMember = require("./lib/searchMember"),
	userInfo = require("./lib/userInfo");

var redisTest = require("./lib/redisTest");
//App configruation, environment configuration
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);


//Make Routing variables available to webserver for redirection
app.use(login);
app.use(signup);
app.use(database);
app.use(logout);
app.use(home);
app.use(displayMovie);
app.use(displayMember);
app.use(searchMovie);
app.use(createMovie);
app.use(updateMovie);
app.use(deleteMovie);
app.use(issue);
app.use(members);
app.use(movies);
app.use(submit);
app.use(createMember);
app.use(deleteMember);
app.use(updateMember);
app.use(generateBill);
app.use(searchMember);
app.use(userInfo);

app.use(redisTest);

//Redirect Default Page to Login Page
app.get('/', function(req, res) {
	res.redirect('/login');
});


//flush cache on server startup
cache.vlmCache.flush();
//cache.vlmCache.create();

//Start webserver
app.listen(3000);
console.log("VLM Redis Server listening on port 3000..");