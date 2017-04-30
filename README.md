# timehash

A hash that discards keys/values that have sat around too long.

## Install

	npm install timehash

## Example

Specify scan interval (the time between scanning the hash for timed-out keys) in milliseconds.

	var th = new TimeHash({scan_interval: 1000})	// scan once per second

Or just use the default interval of 10 seconds (10 * 1000 milliseconds).
Note that if you insert objects into the hash with TTL's of less than the scan_interval, you
may be able to remove them after their time-out has elapsed.

	var th = new TimeHash()

	var payload = { foo: "bar" };		// any object can be inserted with the key
	var key = "the foo";				// any string can be used as a key
	var ttl = 60 * 1000;				// the time-to-live

	th.insert( payload, key, ttl )		// put the object into the hash.

	...

	// If less than ttl time has elapsed you will get your object back
	// Otherwise, payload will be null as it was dropped from the hash.

	payload = th.remove( key )		


