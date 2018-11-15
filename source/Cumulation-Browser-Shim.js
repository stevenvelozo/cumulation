/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* Cumulation browser shim loader
*/

// Load the cumulation module into the browser global automatically.
const libCumulation = require('./Cumulation.js');

if (typeof(window) === 'object')
    window.Cumulation = libCumulation;

module.exports = libCumulation;