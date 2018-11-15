/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* Cumulation browser shim loader
*/

// Load the cumulation module into the browser global automatically.
window.Cumulation = require('./Cumulation.js');
module.exports = window.Cumulation;