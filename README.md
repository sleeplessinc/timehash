# timehash

A container that discards keys/values that have sat around too long.

## Install

	npm install timehash

## Example


	var th = new TimeHash()

	var payload = { foo: "bar" };		// any object can be inserted 
	var key = "the foo";				// any string can be used as the key
	var ttl = 60 * 1000;				// time-to-live

	th.insert( payload, key, ttl )		// put the object into the hash.

	...

	payload = th.remove( key )		

	// If less than ttl time has elapsed, then you will get your object back
	// Otherwise, you will get null as the payload was dropped from the hash
	// before you tried to remove it.

## Options

Include an options object to the constructor to specify the scan interval in milliseconds.
The scan interval is the time between scans of the hash for timed-out keys.

	var th = new TimeHash({scan_interval: 1000})	// scan once per second

The default interval is 10 seconds (10 * 1000 milliseconds).

Note that if you insert objects into the hash with TTL's that are not significantly shorter
than the scan interval, you may be able to remove them after their time-out has elapsed.
So keep your TTLs well above the scan interval.

## License

See LICENSE.txt


