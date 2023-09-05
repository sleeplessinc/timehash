
const TimeHash = function( _opts ) {

	const opts = {
		scan_interval: 10 * 1000,
		refresh_on_get: false,
	};
	for( const k in _opts ) {
		if( _opts[ k ] )
			opts[ k ] = _opts[ k ];
	}

	let timer = null;
	const wraps = {};		// stores the msgs (inside a wrapper for tracking/expiration)


	const get = function( id ) {
		let payload = undefined;
		const w = wraps[ id ];
		if( w ) {
			payload = w.payload;
			if( w.refresh_ttl ) {
				// restart the ttl
				w.expire = Date.now() + ( parseInt( w.refresh_ttl ) || ( 60 * 1000 ) );
			}
		}
		return payload;
	}

	// remove and return an item
	const rem = function( id ) {
		let payload = undefined;
		const w = wraps[ id ];
		if( w ) {
			payload = w.payload;
			delete wraps[ id ];
			if( Object.keys( wraps ).length == 0 && timer ) {
				clearInterval(timer)
				timer = null;
			}
		}
		return payload;
	}


	// insert an item 
	// ttl is in milliseconds and should not be less than 10,000 (default is 60,000 if not provided)
	const put = function( id, payload, ttl, on_expire ) {
		const old_w = wraps[ id ];
		const old_payload = old_w ? old_w.payload : undefined;
		const w = {
			expire: Date.now() + ( parseInt( ttl ) || ( 60 * 1000 ) ),
			payload,
			refresh_ttl: ttl,
		}
		wraps[ id ] = w;
		if( Object.keys( wraps ).length > 0 && timer === null ) {
			timer = setInterval(function() {
				const t = Date.now()
				for( const k in wraps ) {
					const w = wraps[ k ];
					if( t >= w.expire ) {
						// this item has expired
						rem( k );
						if( on_expire )
							on_expire( payload );
					}
				}
			}, opts.scan_interval );
		}
		return old_payload;
	}


	const keys = function() {
		return Object.keys( wraps );
	}

	this.rem = rem;
	this.put = put;
	this.get = get;
	this.keys = keys;
}


if( process && process.version && process.arch && process.platform ) {
	// smells like node.js
	module.exports = TimeHash

	if( require && require.main === module ) {
		require( "./test.js" );
	}

} else {
	// assume browser
	globalThis.TimeHash = TimeHash;
}


