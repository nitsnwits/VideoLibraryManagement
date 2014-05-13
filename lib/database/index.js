/**
 * Database connection details
 * Pool prototype implementation
 */

function createConnection(connection) {
	var mysql = require('mysql'),
	    connection = mysql.createConnection({
		host	: 'localhost',
		user	: 'neeraj',
		password: 'neeraj',
		port	: '3306',
		database: 'videolibrarymanagementdb'
	});
	connection.connect();
	return connection;
}

function connectionPool(numOfConnections) {
	var connection;
	this.allConnections = [];
	this.freeConnections = [];
	this.connectionQueue = [];
	for(var i=0; i<numOfConnections; i++) {
		connection = createConnection();
		this.freeConnections.push(connection);
		this.allConnections.push(connection);
	}
	this.last = 0;
}

connectionPool.prototype.get = function() {
	var conn = this.freeConnections[this.last];
	this.last++;
	if(this.last == this.freeConnections.length) {
		this.last = 0;
	}
	return conn;
};

function connectDB(sql, pool, callback) {
	if(sql.length == 0) {
		console.log("No query specified.");
	} else {
		pool.get().query(sql, function(err, rows, fields){
			if(rows.length!==0){
				//console.log("DATA : "+ rows);
				callback(err, rows);
			} else {
				rows = {rows: 0};
				callback(err, rows);
			}
		});		
	}
}

function connectDBpost(sql, pool, post,callback) {
    //console.log("pst::"+post);
    if(sql.length == 0) {
        console.log("No query specified.");
    } else {
        pool.get().query(sql,post, function(err, rows, fields){
            if(rows.length!==0){
                //console.log("DATA : "+ rows);
                callback(err, rows);
            } else {
                //consle.log("error");
                rows = {rows: 0};
                callback(err, rows);
            }
        });        
    }
}

var databasePool = new connectionPool(10);
module.exports.connectDB = connectDB;
module.exports.connectDBpost = connectDBpost;
module.exports.databasePool = databasePool;