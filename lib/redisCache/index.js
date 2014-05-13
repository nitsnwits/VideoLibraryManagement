/**
 * Caching mechanism
 *  -- REDIS SQL Caching
 *  -- Store SQL's run on any table on a separate hash of that table as string as key
 *  -- Store the results of SQL query as values of hash of that table
 *  -- Upon retrieval, you need to parse JSON, because redis stores everything as string
 */

var redis = require("redis");

function cache() {
	this.client = redis.createClient();
	this.client.flushall();
	this.stats = {
			hits: 0,
			misses: 0,
			keys: 0
	};
}

cache.prototype.get = function(hash, key, cb) { //call it as .get(err, value)
	var _this = this;
	this.client.hexists(hash, key, function(err, exists) {
		if(exists) {
			_this.stats.hits++;
			_this.client.hget(hash, key, function(err, val) {
				if(err) {
					cb(err, null);
				} else {
					cb(null, JSON.parse(val));
				}
			});
		} else {
			_this.stats.misses++;
			cb(null, null);
		}
	});
};

cache.prototype.set = function(hash, key, value, cb) { //call it as .set(err, success)
	if(cb === null) {
		cb = function() {};
	}
	var val = JSON.stringify(value);
	this.client.hset(hash, key, val);
	this.stats.keys++;
	cb(null, true); //error, success in callback
};

cache.prototype.getStats = function() { //to return statistics for testing
	return this.stats;
};

cache.prototype.flush = function() { //call it as .flush()
	this.client.flushall();
	this.stats = {
			hits: 0,
			misses: 0,
			keys: 0
	};
};

cache.prototype.close = function() { //close connections
	this.client.end();
};

cache.prototype.create = function() {
	this.client.end();
	this.client = redis.createClient();
};

cache.prototype.invalidate = function(hash, cb) { //call it as .invalidate(hash, cb)
	var _this = this;
	this.client.hlen(hash, function(err, val) {
		if(err) {
			throw cb(err);
		} else {
			_this.stats.keys = _this.stats.keys - val;
			_this.client.del(hash, function(err, res) {
				if(err) {
					throw cb(err);
				}
			});
		}
	});
};

var vlmCache = new cache();
module.exports.vlmCache = vlmCache;

