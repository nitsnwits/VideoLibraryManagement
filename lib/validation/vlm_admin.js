var request = require("request");
var request = request.defaults({
	jar : true
});
var randomNum = Math.floor((Math.random() * 9000) + 1000);
var randomNum2 = Math.floor((Math.random() * 90) + 10);
var randomNum3 = Math.floor((Math.random() * 9) + 1);
var randomUser = Math.floor((Math.random() * 10000000) + 1);

// Check Admin functionalities

//for admin signIn
var randomUserId = randomUser;
var membershipId = "199-" + randomNum2 + "-" + randomNum;
console.log("membership id :::;" + membershipId);
var Fname = "Fname_" + randomUserId;
var Lname = "Lname_" + randomUserId;
var Email = "admin";
var Password = "admin";
var address1 = "addres1" + randomUserId;
var address2 = "address2" + randomUserId;
//=======

//for new Movie
var MovieName = "name_" + randomNum;
var MovieBanner = "banner_" + randomNum;
var MovieCategory = "cat" + randomNum;
var MovieReleaseDate = randomNum;
var MovieRentAmount = randomNum3;
var MovieAvailableCopies = randomNum3;
//====

//for create simple member
var randomUserId = randomUser;
var simpleMembershipId = "112-" + randomNum2 + "-" + randomNum;
console.log("membership id :::;" + membershipId);
var sFname = "Fname_" + randomUserId;
var sLname = "Lname_" + randomUserId;
var sEmail = "User_" + membershipId;
var sPassword = "Pass_" + randomUserId;
var saddress11 = "addres1" + randomUserId;
var saddress21 = "address2" + randomUserId;
//=========

//// Get signUp page
//request({
//	uri : "http://127.0.0.1:3000/signup",
//	method : "GET",
//	timeout : 10000,
//	followRedirect : true,
//	maxRedirects : 10
//}, function(error, response, body) {
//	if (error || response.statusCode !== 200) {
//		return console.error(error);
//	}
//	// console.log(body);
//	console.log("Sign up page access is successful.");
//});
//
//// Sign up with automatically created user and then access product page to test
//
//request({
//	uri : "http://127.0.0.1:3000/signup",
//	method : "POST",
//	timeout : 10000,
//	followRedirect : true,
//	maxRedirects : 10,
//	form : {
//		"Membership ID" : membershipId,
//		"Email" : Email,
//		"First Name" : Fname,
//		"Last Name" : Lname,
//		"Password" : Password,
//		"Password confirmation" : Password,
//		"Address1" : address1,
//		"Address2" : address2,
//		"City" : "Santa Clara",
//		"State" : "CA",
//		"Zipcode" : 95051,
//		"isPremium" : 0
//	}
//}, function(error, response, body) {
//	if (error || response.statusCode !== 200) {
//		return console.error(error);
//	}
//	console.log("Successfully Signed up with user " + Email);
//
//	
//});


//Login to system with new user
request({
	uri : "http://127.0.0.1:3000/login",
	method : "POST",
	timeout : 10000,
	followRedirect : true,
	maxRedirects : 10,
	form : {
		Username : Email,
		Password : Password
	}
}, function(error, response, body) {
	if (error || response.statusCode !== 200) {
		return console.error(error);
	}
	console.log("Successfully logged in with user " + Email);

	
	
	
	// Submit form data to add a movie
	request.post({
		uri : "http://127.0.0.1:3000/createMovie",
		form : {
			"Name" : MovieName,
			"Banner" : MovieBanner,
			"Category" : MovieCategory,
			"Release Date" : MovieReleaseDate,
			"Rent Amount" : MovieRentAmount,
			"Available Copies" : MovieAvailableCopies
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Added movie Frozen successfully.");
	});
	
	// get update movie page
	var movieId = 1;
	request.get("http://127.0.0.1:3000/updateMovie", function(error,
			response, body) {
		if (error || response.statusCode !== 200) {
			return console.error(error);
		}
		// console.log(body);
		console.log("Update Movie page access is successful.");
	});

	// Submit form data for adding a movieId
	request.post({
		uri : "http://127.0.0.1:3000/updateMovie",
		form : {
			"Movie ID" : movieId
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Fetched movie id = " + movieId + " successfully.");
	});

	// Submit form data with update
	request.post({
		uri : "http://127.0.0.1:3000/updateTheMovie",
		form : {
			"Name" : "updatedName" + randomNum,
			"Banner" : "updatedBanner" + randomNum,
			"Category" : "updatedCategory" + randomNum,
			"Release Date" : randomNum,
			"Rent Amount" : randomNum3,
			"Available Copies" : randomNum3,
			"Movie Id" : movieId
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Updated the movie with id = " + movieId+ " successfully.");
	});

	// get delete movie page
	request.get("http://127.0.0.1:3000/deleteMovie", function(error,
			response, body) {
		if (error || response.statusCode !== 200) {
			return console.error(error);
		}
		// console.log(body);
		console.log("Delete Movie page access is successful.");
	});

	// //Submit form data for deleting a movie
	// request.post({uri: "http://127.0.0.1:3000/deleteMovie", form: {
	// "Movie ID": movieId}
	// },
	// function(err, res, body) {
	// if(err || res.statusCode !== 200) {
	// return console.error(err);
	// }
	// console.log("Deleted movie id = " + movieId + " successfully.");
	// });
	//	

	// get create member page
	request.get("http://127.0.0.1:3000/createMember", function(error,
			response, body) {
		if (error || response.statusCode !== 200) {
			return console.error(error);
		}
		// console.log(body);
		console.log("Create Member page access is successful.");
	});

	// Submit form data to add a member
	request.post({
		uri : "http://127.0.0.1:3000/createMember",
		form : {
			"Membership ID" : simpleMembershipId,
			"Email" : sEmail,
			"First Name" : sFname,
			"Last Name" : sLname,
			"Password" : sPassword,
			"Password confirmation" : sPassword,
			"Address1" : saddress11,
			"Address2" : saddress21,
			"City" : "Santa Clara",
			"State" : "CA",
			"Zipcode" : 95051,
			"isPremium" : 2
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Added member Layla successfully.");
	});

	// get update member page

	request.get("http://127.0.0.1:3000/updateMember", function(error,
			response, body) {
		if (error || response.statusCode !== 200) {
			return console.error(error);
		}
		// console.log(body);
		console.log("Update Member page access is successful.");
	});
	
	// Submit form data for update
	request.post({
		uri : "http://127.0.0.1:3000/updateMemberSearch",
		form : {
			"Email ID" : sEmail
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Fetched the member with email id = " + sEmail + " .");
	});
	// Submit form data with update
	var memberId = 2;
	request.post({
		uri : "http://127.0.0.1:3000/updateThisMember",
		form : {
			"Membership ID" : "111-11-1111",
			"Email" : "ls@hotmail.com",
			"First Name" : "updatedName",
			"Last Name" : "updatedLastName",
			"Password" : 1234,
			"Address1" : 10,
			"Address2" : 10,
			"City" : "Santa Clara",
			"State" : "CA",
			"Zipcode" : 95051,
			"id" : memberId
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Updated the member with id = " + memberId+ " successfully.");
	});

	// get delete member page
	request.get("http://127.0.0.1:3000/deleteMember", function(error,
			response, body) {
		if (error || response.statusCode !== 200) {
			return console.error(error);
		}
		// console.log(body);
		console.log("Delete Member page access is successful.");
	});

	// //Submit form data for deleting a member
	// var membershipId = 123456788;
	// request.post({uri: "http://127.0.0.1:3000/deleteMember", form: {
	// "Membership ID": membershipId}
	// },
	// function(err, res, body) {
	// if(err || res.statusCode !== 200) {
	// return console.error(err);
	// }
	// console.log("Deleted member where membsership id = " + membershipId +
	// ".");
	// });
	
	// get browse all member page
	request.get("http://127.0.0.1:3000/getAllMembers", function(error,
			response, body) {
		if (error || response.statusCode !== 200) {
			return console.error(error);
		}
		// console.log(body);
		console.log("Browse all member page access is successful.");
	});

	// Submit form data for fetching Premium member
	var member = 1;
	request.post({
		uri : "http://127.0.0.1:3000/getAllMembers",
		form : {
			"member" : member
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Fetched all premium member.");
	});

	// Submit form data for fetching Simple member
	var simpleMember = 2;
	request.post({
		uri : "http://127.0.0.1:3000/getAllMembers",
		form : {
			"member" : simpleMember
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Fetched all simple member.");
	});

	// //Submit form data for fetching all member
	// var member = 0;
	// request.post({uri: "http://127.0.0.1:3000/getAllMembers", form: {
	// "member": member}
	// },
	// function(err, res, body) {
	// if(err || res.statusCode !== 200) {
	// return console.error(err);
	// }
	// console.log("Fetched all member.");
	// });

	// get browse all movie page
	request.get("http://127.0.0.1:3000/getAllMovies", function(error,
			response, body) {
		if (error || response.statusCode !== 200) {
			return console.error(error);
		}
		// console.log(body);
		console.log("Browse all movies page access is successful.");
	});

	// Submit form data for fetching all movies
	var cat = "All";
	request.post({
		uri : "http://127.0.0.1:3000/getAllMovies",
		form : {
			"cat" : cat
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Fetched all  movies.");
	});
	
	//----------------
	//issu movie
	//---------------
	
	// get issue a movie page
	request.get("http://127.0.0.1:3000/issueForm", function(error,
			response, body) {
		if (error || response.statusCode !== 200) {
			return console.error(error);
		}
		// console.log(body);
		console.log("Issue a movie page access is successful.");
	});

	// Submit form data for fetching all movies

	request.post({
		uri : "http://127.0.0.1:3000/issue",
		form : {
			"cat" : "All"
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Fetched all  movies.");
	});

	// Submit form data for fetching issed movies
	var memid =  simpleMembershipId;
	var movid = 1;
	request.post({
		uri : "http://127.0.0.1:3000/issueMovie",
		form : {
			"memid" : memid,
			"movid" : movid
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Issued movie.");
	});
	
	//------------
	//serch member
	//-----------
	
	// get search member page
	request.get("http://127.0.0.1:3000/searchMember", function(error,
			response, body) {
		if (error || response.statusCode !== 200) {
			return console.error(error);
		}
		// console.log(body);
		console.log("search member page access is successful.");
	});

	// Search member with any word.
	var fullText = Fname;
	request.post({
		uri : "http://127.0.0.1:3000/searchMember",
		form : {
			"fullText" : fullText
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Searched member with any word.");
	});

	// Search member with membership id.
	request.post({
		uri : "http://127.0.0.1:3000/searchMember",
		form : {
			"membershipId" : membershipId
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Searched member with membership id.");
	});

	// Search member with email id.
	
	request.post({
		uri : "http://127.0.0.1:3000/searchMember",
		form : {
			"email" : Email
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Searched member with email id.");
	});

	// Search member with first name.
	var firstName = Fname;
	request.post({
		uri : "http://127.0.0.1:3000/searchMember",
		form : {
			"fName" : firstName
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Searched member with first name.");
	});

	// Search member with last name.
	var lastName = Lname;
	request.post({
		uri : "http://127.0.0.1:3000/searchMember",
		form : {
			"lName" : lastName
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Searched member with last name.");
	});

	// Search member with address line 1.
	
	request.post({
		uri : "http://127.0.0.1:3000/searchMember",
		form : {
			"address1" : address1
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Searched member with address line 1.");
	});

	// Search member with address line 2.
	
	request.post({
		uri : "http://127.0.0.1:3000/searchMember",
		form : {
			"address2" : address2
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Searched member with address line 2.");
	});

	// Search member with city.
	var city = "Santa Clara";
	request.post({
		uri : "http://127.0.0.1:3000/searchMember",
		form : {
			"city" : city
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Searched member with city.");
	});

	// Search member with state.
	var state = "CA";
	request.post({
		uri : "http://127.0.0.1:3000/searchMember",
		form : {
			"state" : state
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Searched member with state.");
	});

	// Search member with zip.
	var zip = 95051;
	request.post({
		uri : "http://127.0.0.1:3000/searchMember",
		form : {
			"zip" : zip
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Searched member with zip.");
	});


	//---------------
	//serch movie
	//-------------
	
	// get search movie page
	request.get("http://127.0.0.1:3000/searchMovie", function(error,
			response, body) {
		if (error || response.statusCode !== 200) {
			return console.error(error);
		}
		// console.log(body);
		console.log("search movie page access is successful.");
	});

	// get generate bill page
	request.get("http://127.0.0.1:3000/generateBill", function(error,
			response, body) {
		if (error || response.statusCode !== 200) {
			return console.error(error);
		}
		// console.log(body);
		console.log("generate bill page access is successful.");
	});

	// get create movie page
	request.get("http://127.0.0.1:3000/createMovie", function(error,
			response, body) {
		if (error || response.statusCode !== 200) {
			return console.error(error);
		}
		// console.log(body);
		console.log("Create Movie page access is successful.");
	});

	// Search movie with any word.
	var fullTextM = MovieName;
	request.post({
		uri : "http://127.0.0.1:3000/searchMovie",
		form : {
			"fullText" : fullTextM
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Searched movie with any word.");
	});

	// Search movie with name.
	var movieName = MovieName;
	request.post({
		uri : "http://127.0.0.1:3000/searchMovie",
		form : {
			"movieName" : movieName
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Searched movie with  Name.");
	});

	// Search movie with banner.
	var movieBanner = MovieBanner;
	request.post({
		uri : "http://127.0.0.1:3000/searchMovie",
		form : {
			"movieBanner" : movieBanner
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Searched movie with  Banner.");
	});

	// Search movie with category.
	var movieCategory = MovieCategory;
	request.post({
		uri : "http://127.0.0.1:3000/searchMovie",
		form : {
			"movieCategory" : movieCategory
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Searched movie with Category.");
	});

	// Search movie with rent amount.
	var movieRentAmount = MovieRentAmount;
	request.post({
		uri : "http://127.0.0.1:3000/searchMovie",
		form : {
			"movieRentAmount" : movieRentAmount
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Searched movie with rent amount.");
	});

	// Search movie with available copies.
	var movieAvailableCopies = MovieAvailableCopies;
	request.post({
		uri : "http://127.0.0.1:3000/searchMovie",
		form : {
			"movieAvailableCopies" : movieAvailableCopies
		}
	}, function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Searched movie with available copies.");
	});

	// Logout from admin
	request.post("http://127.0.0.1:3000/logout", function(err, res, body) {
		if (err || res.statusCode !== 200) {
			return console.error(err);
		}
		console.log("Logged out of user admin successfully.");
	});

	
	

	

});


