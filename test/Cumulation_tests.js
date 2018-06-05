/**
* Unit tests for Cumulation
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var Chai = require("chai");
var Expect = Chai.expect;
var Assert = Chai.assert;


var _MockSettings = (
{
	Product: 'Cumulation Test',
	ProductVersion: '0.0.0'
});

suite
(
	'Basic',
	()=>
	{
		setup(()=>{});

		suite
		(
			'Object Sanity',
			()=>
			{
				test
				(
					'The class should initialize itself into a happy little object.',
					(fDone)=>
					{
						var testScope = {};
						var testCumulation = require('../source/Cumulation.js').initialize(_MockSettings, testScope);
						Expect(testCumulation).to.be.an('object', 'Cumulation should initialize as an object directly from the require statement.');
						Expect(testScope)
							.to.have.a.property('cumulation')
							.that.is.a('object');
						Expect(testCumulation.settings)
							.to.be.a('object');
						fDone();
					}
				);
				test
				(
					'Try with a global scope...',
					(fDone)=>
					{
						var testCumulation = require('../source/Cumulation.js').initialize(_MockSettings);
						Expect(testCumulation).to.be.an('object', 'Cumulation should initialize as an object directly from the require statement.');
						Expect(global)
							.to.have.a.property('cumulation')
							.that.is.a('object');
						fDone();
					}
				);
				test
				(
					'Initialize with some basic settings',
					(fDone)=>
					{
						var testCumulation = require('../source/Cumulation.js').initialize(
							{
								Server:'https://my.server.com/1.0/',
								Entity:'Animal',
								Cached:false
							});
						Expect(testCumulation).to.be.an('object', 'Cumulation should initialize as an object directly from the require statement.');
						Expect(testCumulation.settings.Entity)
							.to.equal('Animal');
						Expect(testCumulation.settings.Server)
							.to.equal('https://my.server.com/1.0/');
						fDone();
					}
				)
			}
		);
		suite
		(
			'Logging Tests',
			()=>
			{
				test
				(
					'Each log channel should work.',
					(fDone)=>
					{
						var testScope = {};
						var testCumulation = require('../source/Cumulation.js').initialize(_MockSettings, testScope);

						var tmpTestStart = testCumulation.log.getTimeStamp();

						Expect(testScope)
							.to.have.a.property('cumulation')
							.that.is.a('object');
						Expect(testCumulation.log)
							.to.be.a('object');
						testCumulation.log.trace('Test 1');
						testCumulation.log.debug('Test 2');
						testCumulation.log.info('Test 3');
						testCumulation.log.warning('Test 4');
						testCumulation.log.error('Test 5');


						testCumulation.log.logTimeDelta(tmpTestStart);

						// Test time logging
						testCumulation.log.logTime();
						testCumulation.log.logTimeDelta(tmpTestStart);

						testCumulation.log.logTime('Custom Timestamp Message');
						testCumulation.log.logTimeDelta(tmpTestStart);

						// Exercise object logging
						testCumulation.log.debug('Settings: ', testCumulation.settings);

						testCumulation.log.logTimeDelta(tmpTestStart, 'Test Complete');

						fDone();
					}
				);
			}
		);
	}
);