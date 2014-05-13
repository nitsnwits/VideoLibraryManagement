/**
 * Issue Movie Page
 */
var express = require("express");
var app = express();
var database = require("../database");
var sql = '';
var catas;
var userdata,moviedata,orderdata;
var rows1;

app.set('views', __dirname);
app.set('view engine', 'jade');





app.get('/issueForm', function (req, res){
	if (req.session.userType === 0) {
	sql = 'SELECT DISTINCT category FROM movies';
	database.connectDB(sql, database.databasePool, function(err, rows) {
	rows1=rows;
	if(err || rows.rows == 0) {
		res.render('../views/error', {error: {"message": "No results found."}});
		return;
	}else {
		
	res.render('issueForm.jade', {
	catas : rows1});
		
	}});
	}else{
		res.render('../login/restricted');
		return;
	}
	});


app.post('/issue', function (req, res){
	if (req.session.userType === 0) {
	//sql = 'select * from movies';
	if (req.body.cat === "All")
	{sql = 'select * from movies';}
else{
sql = 'select * from movies where category=\'' + req.body.cat + '\'';}
	database.connectDB(sql, database.databasePool, function(err, rows) {
		if(err || rows.rows == 0) {
			res.render('../views/error', {error: {"message": "No results found."}});
			return;
	}else {
res.render('issue.jade', {
results : rows, catas : rows1});

}});
	}else {
		
		res.render('../login/restricted');
		return;
	}
		});




//values coming mem, ac, mi
app.post('/issueMovie', function (req, res){
	//console.log(req.params.number);
	//console.log(req.body.memid);
	//console.log(req.body.movid);
	var count = 0;
	var memberid;
	if (req.session.userType === 0) {
		//req.params.number is Movie id, req.session.user is userID
		sql = 'SELECT id,adminFlag FROM members where membershipId=\'' + req.body.memid +'\'';
		database.connectDB(sql, database.databasePool, function(err, rows) {
			if(err || rows.rows == 0) {
				res.render('../views/error', {error: {"message": "No results found."}});
				return;
			} else {console.log(rows);
				var userdata = rows;
				//memberid= userdata[0].id;
				//console.log(memberid);
				if (userdata[0].adminFlag === 0){
					res.render('issueError', {error : { message : 'Cannot Issue Movie to Admin.'}});
					
				}else{
				if (userdata[0].adminFlag === 2){count = 2;}else if(userdata[0].adminFlag === 1){count = 10;}
				
				sql = 'SELECT availableCopies,rentAmount  FROM movies where id=\'' + req.body.movid +'\'';
				database.connectDB(sql, database.databasePool, function(err, rows) {
					if(err || rows.rows == 0) {
						res.render('../views/error', {error: {"message": "No results found."}});
						return;
					} else {console.log(rows);
						moviedata = rows;
						//console.log(memberid);
						sql = 'SELECT COUNT(memberId) AS issued FROM orders where memberId=\'' + userdata[0].id +'\'';
						console.log(sql);
						database.connectDB(sql, database.databasePool, function(err, rows) {
							if(err || rows.rows == 0) {
								res.render('../views/error', {error: {"message": "No results found."}});
								return;
							} else {
								orderdata = rows;
								console.log(orderdata[0].issued);
						if (moviedata[0].availableCopies !== 0 && orderdata[0].issued < count){
							sql = 'insert into orders (memberId, movieId, issueDate, movieAmount) values (\'' + userdata[0].id +'\',\'' + req.body.movid +'\',curdate(),\''+moviedata[0].rentAmount+'\' )';
							console.log(sql);
							console.log("1Kuddos!!");
							database.connectDB(sql, database.databasePool, function(err, rows) {
								if(err || rows.rows == 0) {
									res.render('../views/error', {error: {"message": "No results found."}});
									return;
								} else {console.log("2Kuddos!!");
								//sql = 'UPDATE orders SET isSubmitted=\'1\', submitDate = curdate() WHERE =\'\'';
								sql = 'UPDATE movies SET availableCopies=availableCopies - 1 WHERE id=\''+ req.body.movid +'\' and availableCopies > 0';
								
								database.connectDB(sql, database.databasePool, function(err, rows) {
									if(err || rows.rows == 0) {
										res.render('../views/error', {error: {"message": "No results found."}});
										return;
									} else {
										
										sql = "select sum(movieAmount) as vbalance from orders where memberId="+userdata[0].id;
										database.connectDB(sql, database.databasePool, function(err, rows) {
											if(err || rows.rows == 0) {
												res.render('../views/error', {error: {"message": "No results found."}});
												return;
											} else {
												var vbalance=rows[0].vbalance;
												sql = "update members set balance = "+vbalance+" where Id="+userdata[0].id;
												database.connectDB(sql, database.databasePool, function(err, rows) {
													if(err) {
														//throw err;
														res.render('issueError', {error : { message : 'Something went Wrong while inserting into Subscription.  But Movie is issued.'}});
														return;
													} else {
														
														console.log("Kuddos!! for Sam");
													}
												});
												
											}
										});
										
										
										
										console.log("3Kuddos!!");
										res.render('issueSuccess.jade');
										return;
									}
									});
								}
								});
						}else{
							if (moviedata[0].availableCopies === 0){
								
								res.render('issueError', {error : { message : 'No Copies Available.'}});
								return;
							}else{
							
							res.render('issueError', {error : { message : 'User has exceeded movie limit!!'}});
							return;
							}
						}
					
						}
					});
					}
				});
			}}
		});
		

} else {
		res.render('../login/restricted');
		return;
	}
});

module.exports = app;