/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* Cumulation browser sync library
*
* @class Cumulation
*/
var Cumulation = ()=>
{
	createNew = (pSettings, pScope) =>
	{
		// Initialize the scoping object for Cumulation.
		var _Scope = (typeof(pScope) === 'object') ? pScope :      // Use the passed-in scope if it is a valid object
					 (typeof(window) !== 'undefined') ? window :   // Check for a browser window object (in-browser mode)
					 global;                                       // Use the es6 global scope, per Node

		// Dependencies are shared with children like this so we can share them
		// This keeps them minified and safe to use across the browser, node and even sandboxed templates
		var _Dependencies = {};
		_Dependencies.async = require('async');
		_Dependencies.underscore = require('underscore');
		_Dependencies.moment = require('moment');
		_Dependencies.localforage = require('localforage');
		_Dependencies.simpleget = require('simple-get');
		_Dependencies.cookie = require('cookie');
		_Dependencies.matilde = require('matilde');


		// Setup the application settings object
		var libFableSettings = require('fable-settings');
		// TODO: Enhance fable-settings to have a stripped-down default object for cases like this
		// Delete the extraneous properties from the standard fable settings defaults.
		delete libFableSettings.default.APIServerPort;
		delete libFableSettings.default.ConfigFile;
		delete libFableSettings.default.SessionStrategy;
		delete libFableSettings.default.MemcachedURL;
		delete libFableSettings.default.MongoDBURL;
		delete libFableSettings.default.MySQL;
		delete libFableSettings.default.LogStreams;

		var _SettingsManager = libFableSettings.new(pSettings);
		_SettingsManager.fill(require('./Cumulation-Settings-Default.js'));
		var _Settings = _SettingsManager.settings

		// Our factory object
		var oCumulation = (
		{
			initialize: createNew
		});


		/**
		 * External Dependency Libraries
		 *
		 * @property libs
		 * @type object
		 */
		Object.defineProperty(oCumulation, 'libs',
			{
				get: function() { return _Dependencies; },
				enumerable: true
			});

		/**
		 * Settings
		 *
		 * @property settings
		 * @type object
		 */
		Object.defineProperty(oCumulation, 'settings',
			{
				get: function() { return _SettingsManager.settings; },
				enumerable: true
			});

		// This has behaviors similar to bunyan, for consistency
		var _Log = require('./Cumulation-Log.js')(oCumulation);
		/**
		 * Logging
		 *
		 * @property log
		 * @type object
		 */
		Object.defineProperty(oCumulation, 'log',
			{
				get: function() { return _Log; },
				enumerable: true
			});		 

		var parseFilter = (pFilter) =>
		{
			if (typeof(pFilter) === 'string')
				return pFilter;
			else if (typeof(pFilter) === 'number')
				return pFilter.toString();
			//else if (typeof(pFilter) === 'object')
			//	return _Dependencies.matilde
			else
				return '';
		};
		// setOnlineStatus
		// getRecords(pOptionalFilter)
		oCumulation.getRecordFromServer = (pRecordID, fCallback) =>
		{
			var tmpCallBack = (typeof(fCallback) === 'function') ? fCallback : ()=>{};
			var tmpURL = _Settings.Server+_Settings.Entity+'/'+pRecordID;
			var tmpRequestOptions = (
			{
				url: tmpURL,
				headers:
				{
					cookie: ''
				}
			});

			var tmpCookies = [];
			Object.keys(_Settings.Cookies).forEach((pKey)=>
				{
					tmpCookies.push(_Dependencies.cookie.serialize(pKey, _Settings.Cookies[pKey]));
				});
			tmpRequestOptions.headers.cookie = tmpCookies.join(';');

			if (_Settings.DebugLog)
				_Log.debug(`Beginning request`,tmpRequestOptions);
			var tmpRequestTime = _Log.getTimeStamp();

			_Dependencies.simpleget.get(tmpRequestOptions, (pError, pResponse)=>
				{
					if (pError)
					{
						return tmpCallBack(pError);
					}
					if (_Settings.DebugLog)
						_Log.debug(`--> connected in ${_Log.getTimeDelta(tmpRequestTime)}ms code ${pResponse.statusCode}`);

					var tmpData = '';

					pResponse.on('data', (pChunk)=>
						{
							if (_Settings.DebugLog)
								_Log.debug(`--> data chunk size ${pChunk.length}b received in ${_Log.getTimeDelta(tmpRequestTime)}ms`);
							tmpData += pChunk;
						});

					pResponse.on('end', ()=>
						{
							var tmpResult = null;
							if (tmpData)
								tmpResult = JSON.parse(tmpData);
							if (_Settings.DebugLog)
							{
								_Log.debug(`==> completed data size ${tmpData.length}b received in ${_Log.getTimeDelta(tmpRequestTime)}ms`,tmpResult);
							}
							tmpCallBack(pError, tmpResult);
						});
				});
		};
		oCumulation.getRecord = (pRecordID, fCallback) =>
		{
			oCumulation.getRecordFromServer(pRecordID, fCallback);
		};
		var getRecordByID = (pRecordID) =>
		{

		};

		// Register dependencies globally with the browser if they aren't there
		var registerGlobalDependency = (pDependencyHash, pDependency) =>
		{
			// Check that it isn't there yet...
			if (!window.hasOwnProperty(pDependencyHash))
			{
				_Log.info('Cumulation is registering a global browser dependency: '+pDependencyHash);
				window[pDependencyHash] = _Dependencies[pDependency];
			}
		};

		// Create a variable with cumulation in it within the module scope.
		_Scope.cumulation = oCumulation;

		return oCumulation;
	}

	// Cumulation requires that you initialize it so you can pass in a scope for node.
	// This allows us to not have global variables in nodejs.
	return {initialize: createNew};
};

module.exports = Cumulation();