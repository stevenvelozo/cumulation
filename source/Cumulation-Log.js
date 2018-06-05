/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* Cumulation Logging
*
* @class CumulationLog
*/

var CumulationLog = function()
{
	function createNew(pCumulation)
	{
		var _Cumulation = pCumulation;

		// Write a log message to the console
		var writeConsole = function(pLevel, pMessage, pObject)
		{
			// Write the message
			console.log('['+pLevel+'] ('+_Cumulation.settings.Entity+') '+pMessage);

			// Write out the object if it is passed in
			if (typeof(pObject) !== 'undefined')
			{
				console.log(JSON.stringify(pObject, null, 4));
			}
		};

		var logTrace = function(pMessage, pObject)
		{
			writeConsole('TRACE', pMessage, pObject);
		};

		var logDebug = function(pMessage, pObject)
		{
			writeConsole('DEBUG', pMessage, pObject);
		};

		var logInfo = function(pMessage, pObject)
		{
			writeConsole('INFO', pMessage, pObject);
		};

		var logWarning = function(pMessage, pObject)
		{
			writeConsole('WARNING', pMessage, pObject);
		};

		var logError = function(pMessage, pObject)
		{
			writeConsole('ERROR', pMessage, pObject);
		};


		// Log the current date and time, well formatted (with Moment-Timezone)
		var logTime = function(pMessage)
		{
			var tmpMessage = (typeof(pMessage) !== 'undefined') ? pMessage : 'Time';
			logInfo(tmpMessage+': '+_Cumulation.libs.moment().format('MMMM Do YYYY, HH:mm:ss.SSS'))
		};

		// Get a timestamp 
		var getTimeStamp = function()
		{
			return +new Date();
		};

		var getTimeDelta = (pTimeStamp)=>
		{
			var tmpEndTime = +new Date();
			return tmpEndTime-pTimeStamp;
		};

		// Log the delta between a timestamp, and now with a message
		var logTimeDelta = function(pTimeStamp, pMessage)
		{
			var tmpMessage = (typeof(pMessage) !== 'undefined') ? pMessage : 'Time Measurement';

			var tmpEndTime = +new Date();
			var tmpOperationTime = tmpEndTime-pTimeStamp;

			logInfo(tmpMessage +' ('+tmpOperationTime+'ms)');
		};

		// Our factory object
		var oCumulationLog = (
		{
			trace: logTrace,
			debug: logDebug,
			info: logInfo,
			warning: logWarning,
			error: logError,

			logTime: logTime,

			getTimeStamp: getTimeStamp,
			getTimeDelta: getTimeDelta,
			logTimeDelta: logTimeDelta
		});

		return oCumulationLog;
	}

	// Cumulation requires that you initialize it so you can pass in a scope for node.
	// This allows us to not have global variables in nodejs.
	return createNew;
};

module.exports = new CumulationLog();