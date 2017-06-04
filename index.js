
//var o2j = function(o) { try { return JSON.stringify(o) } catch(e) { return null } }
//var D = function(o) { console.log(o2j(o)) };

var TimeHash = function(in_opts) {

	var opts = {
		scan_interval: 10 * 1000,
	}
	for(var k in in_opts) { if(in_opts[k]) opts[k] = in_opts[k] }

	var mstime = function() { return new Date().getTime() }


	var self = this;
	var timer = null
	var wraps = {}		// stores the msgs (inside a wrapper for tracking/expiration)
	var num = 0			// # msgs waiting

	// Remove and return a msg from the list given its id
	var remove = self.remove = function(id) {
		var p = null
		var w = wraps[id]
		if(w) {
			p = w.payload
			delete wraps[id]
			num -= 1
			if(num == 0) {
				clearInterval(timer)
				timer = null
			}
		}
		return p
	}


	// Put a msg into the list
	// ttl is in milliseconds and should not be less than 10,000 (default is 60,000 if not provided)
	var insert = self.insert = function(p, id, ttl) {
		var old = wraps[id];
		var w = {
			expire: mstime() + (ttl || (60 * 1000)),
			payload: p,
		}
		wraps[id] = w;
		if(old === undefined) {
			num += 1
		}
		if(num == 1) {
			timer = setInterval(function() {
				var t = mstime()
				for(var k in wraps) {
					var w = wraps[k];
					if(t >= w.expire) {
						// it's expired ... toss it.
						remove(k);
					}
				}
			}, opts.scan_interval);
		}
		return old;
	}

}


if((typeof process) !== 'undefined') {
	// node.js

	module.exports = TimeHash

	if(require && require.main === module) {
		// module being executed directly; run tests
		var throwIf = function(c, s) { if(c) { throw new Error(s || "FAILED"); } }
		var L = function(o) { console.log(o) };

		L("Running tests");

		var th = new TimeHash({scan_interval: 1000})

		th.insert("payload", "key", 4000)
		throwIf(th.remove("key") !== "payload", "test 1 failed")
		L("pass 1");

		th.insert("payload", "key", 4000)
		setTimeout(function() {
			throwIf(th.remove("key") !== null, "test 2 failed")
			L("pass 2");
		}, 5000);

		var th = new TimeHash()
	}
}


