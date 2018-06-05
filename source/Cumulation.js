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

		var _Settings = libFableSettings.new(pSettings);

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
				get: function() { return _Settings.settings; },
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