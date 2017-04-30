
var TimeHash = function(in_opts) {

	var opts = {
		timeout_seconds: 10,
	}
	for(var k in in_opts) { if(in_opts[k]) opts[k] = in_opts[k] }


	var self = this;
	var timer = null
	var wraps = {}		// stores the msgs (inside a wrapper for tracking/expiration)
	var num = 0			// # msgs waiting

	// Remove and return a msg from the list given its id
	var rem = self.rem = function(id) {
		var p = null
		var w = wraps[id]
		if(w) {
			p = w.payload
			delete wraps[id]
			num -= 1
			if(num == 0) {
				// D("clearInterval "+timer)
				clearInterval(timer)
				timer = null
			}
			// D("forgetting "+id+" "+o2j(p));
		}
		return p
	}


	// Put a msg into the list
	// ttl is in secs and should not be less than 10 (default is 60 if not provided)
	var ins = self.ins = function(p, id, ttl) {
		//D("remembering "+id+" "+o2j(p));
		var w = {
			expire: time() + (ttl || 60),
			payload: p,
		}
		wraps[id] = w;
		num += 1
		if(num == 1) {
			timer = setInterval(function() {
				var t = time()
				for(var k in wraps) {
					var w = wraps[k];
					if(t >= w.expire) {
						rem(k);
					}
				}
			}, opts.timeout_seconds * 1000);
			//D("setInterval "+timer)
		}
	}

}

if((typeof process) !== 'undefined') {
	// node.js
	module.exports = TimeHash
}


