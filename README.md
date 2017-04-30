# timehash

A hash that discards keys/values that have sat around too long.

## Install

	npm install timehash

## Example


	var th = new TimeHash()				// 10 second scan interval

	var payload = { foo: "bar" };		// any object can be inserted with the key
	var key = "the foo";				// any string can be used as a key
	var ttl = 60 * 1000;				// time-to-live

	th.insert( payload, key, ttl )		// put the object into the hash.

	...

	// If less than ttl time has elapsed you will get your object back
	// Otherwise, payload will be null as it was dropped from the hash.

	payload = th.remove( key )		

## Options

Include an options object to constructor to specify the scan interval in milliseconds.
The scan interval is the time between scans of the hash for timed-out keys.

	var th = new TimeHash({scan_interval: 1000})	// scan once per second

The default interval is 10 seconds (10 * 1000 milliseconds).

Note that if you insert objects into the hash with TTL's that are not significantly greater
than the scan interval, you may be able to remove them after their time-out has elapsed.
So keep the interval well below any TTLs that you'll be using.

