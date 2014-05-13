var request = require("request");
var request = request.defaults({jar: true});
var randomNum = Math.floor((Math.random()*9000)+1000);
var randomNum2 = Math.floor((Math.random()*90)+10);
var randomUser = Math.floor((Math.random()*10000000)+1); //used to create new users for sign up testing


//Check simple member's functionalities

//Sign up with a new user ID and password, created automatically
//Test sign up page
//Get sign up page
request({
  uri: "http://127.0.0.1:3000/signup",
  method: "GET",
  timeout: 10000,
  followRedirect: true,
  maxRedirects: 10
}, function(error, response, body) {
	if(error || response.statusCode !== 200) {
		return console.error(error);
	}
	//console.log(body);
	console.log("Sign up page access is successful.");
});

//Sign up with automatically created user and then access product page to test 
//successful login
var randomUserId = randomUser;
var membershipId = "111-"+randomNum2+"-"+randomNum;
console.log("membership id :::;"+membershipId);
var Fname = "Fname_" + randomUserId;
var Lname = "Lname_" + randomUserId;
var Email = "User_" + membershipId;
var Password = "Pass_" + randomUserId;
var address1 = "addres1"+randomUserId;
var address2 ="address2"+randomUserId;

request({
	uri: "http://127.0.0.1:3000/signup",
	method: "POST",
	timeout: 10000,
	followRedirect: true,
	maxRedirects: 10,
	form: {
		"Membership ID": membershipId,
		"Email": Email,
		"First Name": Fname,
		"Last Name": Lname,
		"Password": Password,
		"Password confirmation": Password,
		"Address1":address1,
		"Address2":address2,
		"City":"Santa Clara",
		"State":"CA",
		"Zipcode":95051,
		"isPremium":2
	}
}, function(error, response, body) {
	if(error || response.statusCode !== 200) {
		return console.error(error);
	}
	console.log("Successfully Signed up with user " + Email);

	//Login to system with new user
	request({
		uri: "http://127.0.0.1:3000/login",
		method: "POST",
		timeout: 10000,
		followRedirect: true,
		maxRedirects: 10,
		form: {
			Username: Email,
			Password: Password
		}
	}, function(error, response, body) {
		if(error || response.statusCode !== 200) {
			return console.error(error);
		}
		console.log("Successfully logged in with user " + Email);

		//get browse all member page
		request.get("http://127.0.0.1:3000/getAllMembers", function(error, response, body) {
			if(error || response.statusCode!==200) {
				return console.error(error);
			}
			//console.log(body);
			console.log("Browse all member page access is successful.");
		});
		
		//Submit form data for fetching Premium member
		var member = 1;
		request.post({uri: "http://127.0.0.1:3000/getAllMembers", form: {
			"member": member}
		},
			function(err, res, body) {
				if(err || res.statusCode !== 200) {
					return console.error(err);
				}
				console.log("Fetched all premium member.");
		});
		
		//Submit form data for fetching Simple member
		var simpleMember = 2;
		request.post({uri: "http://127.0.0.1:3000/getAllMembers", form: {
			"member": simpleMember}
		},
			function(err, res, body) {
				if(err || res.statusCode !== 200) {
					return console.error(err);
				}
				console.log("Fetched all simple member.");
		});
		
//		//Submit form data for fetching all member
//		var member = 0;
//		request.post({uri: "http://127.0.0.1:3000/getAllMembers", form: {
//			"member": member}
//		},
//			function(err, res, body) {
//				if(err || res.statusCode !== 200) {
//					return console.error(err);
//				}
//				console.log("Fetched all  member.");
//		});
		
		//get browse all movie page
		request.get("http://127.0.0.1:3000/getAllMovies", function(error, response, body) {
			if(error || response.statusCode!==200) {
				return console.error(error);
			}
			//console.log(body);
			console.log("Browse all movies page access is successful.");
		});
		
		//Submit form data for fetching all movies
		var cat = "All";
		request.post({uri: "http://127.0.0.1:3000/getAllMovies", form: {
			"cat": cat}
		},
			function(err, res, body) {
				if(err || res.statusCode !== 200) {
					return console.error(err);
				}
				console.log("Fetched all  movies.");
		});
		

		
//		//Submit form data for display movie
//		var number = 3;
//		request.post({uri: "http://127.0.0.1:3000/displayMovie", form: {
//			"number": number}
//		},
//			function(err, res, body) {
//				if(err || res.statusCode !== 200) {
//					return console.error(err);
//				}
//				console.log("Fetched all  data for display movie.");
//		});
//		
//		//Submit form data for display member
//		var number2 = 3;
//		request.post({uri: "http://127.0.0.1:3000/displayMember/:number2"
//		},
//			function(err, res, body) {
//				if(err || res.statusCode !== 200) {
//					return console.error(err);
//				}
//				console.log("Fetched all  data for display member.");
//		});

		//Logout from new users ID
		request.post("http://127.0.0.1:3000/logout", function(err, res, body) {
			if(err || res.statusCode !== 200) {
				return console.error(err);
			}
			console.log("Logged out of user " + Email + " successfully.");
		});
	});
});
