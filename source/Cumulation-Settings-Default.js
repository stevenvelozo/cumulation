/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* Cumulation Configuration Defaults
*/

module.exports = (
	{
		// The server to connect to (with trailing forward slash)
		Server: 'http://127.0.0.1:8080/',
		// The entity name
		Entity: 'Unknown',

		// Whether or not the service should run in online mode
		Online: false,
		// Any cookies to be sent
		Cookies: {},
		
		Headers: {},

		// If cached is false the service will always try to get and put data to the server
		Cached: true,
		// Cache Expiration in ms
		CacheExpirationTime: 300000,

		// If this is true, show a whole lotta logs
		DebugLog: false
	}
);