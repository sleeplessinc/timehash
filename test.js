
console.log( "running tests" );

const throwIf = function( c, s ) { if( c ) { throw new Error( s || "FAILED" ); } }

TimeHash = require( "." )

// create a new TimeHash object 

// default options: { scan_interval: 1000, refresh_on_get: false }
th = new TimeHash()

// specify your own scan interval in milliseconds
th = new TimeHash( { scan_interval: 1000 } )

// put() inserts a payload into the hash with the given key
item = th.put( "k1", "p1" )		// put( key, payload )
// it returns the previously put() payload with the give key,
// or undefined if not previously set or removed with rem()
throwIf( item !== undefined )

// put() can also take a TTL value (default is 60,000 milliseconds )
old = th.put( "k1", "p2", 3000 )
throwIf( old !== "p1" )

// removing an item will remove the key from the hash and return the paylod (if any)
item = th.rem( "k1" )
throwIf( item !== "p2" )
// After removal, calling get() should return undefined
item = th.get( "k1" )
throwIf( item !== undefined )

let start1 = Date.now()
th = new TimeHash( { scan_interval: 1000, } )
// including a callback with put() which gets called when the item is removed due to expiring
th.put( "k2", "p3", 1000, p => {
	throwIf( p !== "p3" )
} )
setTimeout(function() {
	// k2 should have expired by now, so a get() should return undefined
	item = th.get( "k2" )
	throwIf( item !== undefined )
}, 2000)


let start2 = Date.now()
// if refresh_on_get is true in the options, then whenever you do get(), the TTL is reset
th = new TimeHash( { scan_interval: 1000, refresh_on_get: true } )
th.put( "k3", "p4", 2000, p => {
	throwIf( p !== "p4" )
} )
setTimeout(function() {
	// this get() should reset the TTL to 3 seconds after start2
	item = th.get( "k3" )
	throwIf( item !== "p4" )
}, 1000)
setTimeout(function() {
	// this get() will be after the extended TTL, so should return undefined
	item = th.get( "k3" )
	throwIf( item !== undefined )

	console.log( "all tests passed" );

}, 4000)


