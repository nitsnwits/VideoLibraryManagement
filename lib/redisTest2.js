/**
 * 
 */

var redis = require("redis"),
client1 = redis.createClient();

var express = require("express");
var app = express();
var database = require("./database");
var sql = '';
var post = null;

app.set('views', __dirname);
app.set('view engine', 'jade');
app.use(database);

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client1.on("error", function (err) {
	console.log("Error " + err);
});

//client.set("string key", "string val", redis.print);
//client.hset("hash key", "hashtest 1", "some value", redis.print);
//client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
//test setting json:
sql = "select * from movies where id < 3";
database.connectDB(sql, database.databasePool, function(err, rows) {
	if(err) {
		throw err;
	} else {
		//console.log(JSON.stringify(rows));
		var str = JSON.stringify(rows);
		//var strRows = rows;
		client1 = redis.createClient();
		//client1.hset("hash key", "hashtest 1", "some value", redis.print);
		//client1.hset(sql, "moviesHash", str, redis.print);
		client1.hget("movies", sql, function(err, obj) {
			console.log(obj + " .. is the answer");
			var a = JSON.parse(obj);
			console.log(a[0].name); //select one param of that json
			console.log(JSON.stringify(a));
		});
		//console.log(JSON.stringify(strRep) + " .. is the answer");
		//client.hset(sql, "moviesHash", str, redis.print);
	}
});

/*client.hgetall("hosts", function (err, obj) {
    console.dir(obj);
});*/

/*client.hkeys("hash key", function (err, replies) {
	console.log(replies.length + " replies:");
	replies.forEach(function (reply, i) {
		console.log("    " + i + ": " + reply);
	});
	client.quit();
});*/
client1.quit();