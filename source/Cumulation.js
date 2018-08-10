/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* Cumulation browser sync library
*
* @class Cumulation
*/
class Cumulation
{
	constructor(pSettings, pScope)
	{
		this._Dependencies = {};
		this._Dependencies.async = require('async');
		this._Dependencies.underscore = require('underscore');
		this._Dependencies.moment = require('moment');
		this._Dependencies.localforage = require('localforage');
		this._Dependencies.simpleget = require('simple-get');
		this._Dependencies.cookie = require('cookie');
		this._Dependencies.matilde = require('matilde');

		this._Settings = this._Dependencies.underscore.extend(JSON.parse(JSON.stringify(require('./Cumulation-Settings-Default.js'))), pSettings);

		// This has behaviors similar to bunyan, for consistency
		this._Log = new (require('./Cumulation-Log.js'))(this._Dependencies, this._Settings);
		this.log = this._Log;
	}

	parseFilter (pFilter)
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
	
	/**
	 * 
	 * GET RECORD
	 * 
	**/
	getRecordFromServer (pRecordID, fCallback)
	{
		let tmpCallBack = (typeof(fCallback) === 'function') ? fCallback : ()=>{};
		let tmpURL = this._Settings.Server+this._Settings.Entity+'/'+pRecordID;
		let tmpRequestOptions = (
		{
			url: tmpURL,
			headers: this._Dependencies.underscore.extend({cookie: ''}, this._Settings.Headers)
		});

		let tmpCookies = [];
		Object.keys(this._Settings.Cookies).forEach((pKey)=>
			{
				tmpCookies.push(this._Dependencies.cookie.serialize(pKey, this._Settings.Cookies[pKey]));
			});
		tmpRequestOptions.headers.cookie = tmpCookies.join(';');

		if (this._Settings.DebugLog)
			this._Log.debug(`Beginning GET request`,tmpRequestOptions);
		let tmpRequestTime = this._Log.getTimeStamp();

		this._Dependencies.simpleget.get(tmpRequestOptions, (pError, pResponse)=>
			{
				if (pError)
				{
					return tmpCallBack(pError);
				}
				if (this._Settings.DebugLog)
					this._Log.debug(`--> GET connected in ${this._Log.getTimeDelta(tmpRequestTime)}ms code ${pResponse.statusCode}`);

				let tmpData = '';

				pResponse.on('data', (pChunk)=>
					{
						if (this._Settings.DebugLog)
							this._Log.debug(`--> GET data chunk size ${pChunk.length}b received in ${this._Log.getTimeDelta(tmpRequestTime)}ms`);
						tmpData += pChunk;
					});

				pResponse.on('end', ()=>
					{
						let tmpResult = null;
						if (tmpData)
							tmpResult = JSON.parse(tmpData);
						if (this._Settings.DebugLog)
						{
							this._Log.debug(`==> GET completed data size ${tmpData.length}b received in ${this._Log.getTimeDelta(tmpRequestTime)}ms`,tmpResult);
						}
						tmpCallBack(pError, tmpResult);
					});
			});
	};
	getRecord (pRecordID, fCallback)
	{
		this.getRecordFromServer(pRecordID, fCallback);
	};

	/**
	 * 
	 * GET RECORDS (plural)
	 * 
	**/
	getRecordsFromServer (pRecordsString, fCallback)
	{
		let tmpCallBack = (typeof(fCallback) === 'function') ? fCallback : ()=>{};
		let tmpURL = this._Settings.Server+this._Settings.Entity+'s/'+pRecordsString;
		let tmpRequestOptions = (
		{
			url: tmpURL,
			headers: JSON.parse(JSON.stringify(this._Settings.Headers))
		});

		let tmpCookies = [];
		Object.keys(this._Settings.Cookies).forEach((pKey)=>
			{
				tmpCookies.push(this._Dependencies.cookie.serialize(pKey, this._Settings.Cookies[pKey]));
			});
		if (tmpCookies.length > 0)
			tmpRequestOptions.headers.cookie = tmpCookies.join(';');

		if (this._Settings.DebugLog)
			this._Log.debug(`Beginning GET plural request`,tmpRequestOptions);
		let tmpRequestTime = this._Log.getTimeStamp();

		this._Dependencies.simpleget.get(tmpRequestOptions, (pError, pResponse)=>
			{
				if (pError)
				{
					return tmpCallBack(pError);
				}
				if (this._Settings.DebugLog)
					this._Log.debug(`--> GET plural connected in ${this._Log.getTimeDelta(tmpRequestTime)}ms code ${pResponse.statusCode}`);

				let tmpData = '';

				pResponse.on('data', (pChunk)=>
					{
						if (this._Settings.DebugLog)
							this._Log.debug(`--> GET plural data chunk size ${pChunk.length}b received in ${this._Log.getTimeDelta(tmpRequestTime)}ms`);
						tmpData += pChunk;
					});

				pResponse.on('end', ()=>
					{
						let tmpResult = null;
						if (tmpData)
							tmpResult = JSON.parse(tmpData);
						if (this._Settings.DebugLog)
						{
							this._Log.debug(`==> GET plural completed data size ${tmpData.length}b received in ${this._Log.getTimeDelta(tmpRequestTime)}ms`,tmpResult);
						}
						tmpCallBack(pError, tmpResult);
					});
			});
	};
	getRecords (pRecordsString, fCallback)
	{
		this.getRecordsFromServer(pRecordsString, fCallback);
	};	
	/**
	 * 
	 * PUT RECORD
	 * 
	**/
	putRecordToServer (pRecordObject, fCallback)
	{
		let tmpCallBack = (typeof(fCallback) === 'function') ? fCallback : ()=>{};
		let tmpURL = this._Settings.Server+this._Settings.Entity+'/';
		let tmpRequestOptions = (
		{
			url: tmpURL,
			headers: JSON.parse(JSON.stringify(this._Settings.Headers)),
			data: pRecordObject
		});

		let tmpCookies = [];
		Object.keys(this._Settings.Cookies).forEach((pKey)=>
			{
				tmpCookies.push(this._Dependencies.cookie.serialize(pKey, this._Settings.Cookies[pKey]));
			});
		if (tmpCookies.length > 0)
			tmpRequestOptions.headers.cookie = tmpCookies.join(';');

		if (this._Settings.DebugLog)
			this._Log.debug(`Beginning PUT request`,tmpRequestOptions);
		let tmpRequestTime = this._Log.getTimeStamp();

		this._Dependencies.simpleget.put(tmpRequestOptions, (pError, pResponse)=>
			{
				if (pError)
				{
					return tmpCallBack(pError);
				}
				if (this._Settings.DebugLog)
					this._Log.debug(`--> PUT connected in ${this._Log.getTimeDelta(tmpRequestTime)}ms code ${pResponse.statusCode}`);

				let tmpData = '';

				pResponse.on('data', (pChunk)=>
					{
						if (this._Settings.DebugLog)
							this._Log.debug(`--> PUT data chunk size ${pChunk.length}b received in ${this._Log.getTimeDelta(tmpRequestTime)}ms`);
						tmpData += pChunk;
					});

				pResponse.on('end', ()=>
					{
						let tmpResult = null;
						if (tmpData)
							tmpResult = JSON.parse(tmpData);
						if (this._Settings.DebugLog)
						{
							this._Log.debug(`==> PUT completed data size ${tmpData.length}b received in ${this._Log.getTimeDelta(tmpRequestTime)}ms`,tmpResult);
						}
						tmpCallBack(pError, tmpResult);
					});
			});
	};
	putRecord (pRecordObject, fCallback)
	{
		this.putRecordToServer(pRecordObject, fCallback);
	};
	
	/**
	 * 
	 * POST RECORD
	 * 
	**/
	postRecordToServer (pRecordObject, fCallback)
	{
		let tmpCallBack = (typeof(fCallback) === 'function') ? fCallback : ()=>{};
		let tmpURL = this._Settings.Server+this._Settings.Entity+'/';
		let tmpRequestOptions = (
		{
			url: tmpURL,
			headers: JSON.parse(JSON.stringify(this._Settings.Headers)),
			data: pRecordObject
		});

		let tmpCookies = [];
		Object.keys(this._Settings.Cookies).forEach((pKey)=>
			{
				tmpCookies.push(this._Dependencies.cookie.serialize(pKey, this._Settings.Cookies[pKey]));
			});
		if (tmpCookies.length > 0)
			tmpRequestOptions.headers.cookie = tmpCookies.join(';');

		if (this._Settings.DebugLog)
			this._Log.debug(`Beginning POST request`,tmpRequestOptions);
		let tmpRequestTime = this._Log.getTimeStamp();

		this._Dependencies.simpleget.post(tmpRequestOptions, (pError, pResponse)=>
			{
				if (pError)
				{
					return tmpCallBack(pError);
				}
				if (this._Settings.DebugLog)
					this._Log.debug(`--> POST connected in ${this._Log.getTimeDelta(tmpRequestTime)}ms code ${pResponse.statusCode}`);

				let tmpData = '';

				pResponse.on('data', (pChunk)=>
					{
						if (this._Settings.DebugLog)
							this._Log.debug(`--> POST data chunk size ${pChunk.length}b received in ${this._Log.getTimeDelta(tmpRequestTime)}ms`);
						tmpData += pChunk;
					});

				pResponse.on('end', ()=>
					{
						let tmpResult = null;
						if (tmpData)
							tmpResult = JSON.parse(tmpData);
						if (this._Settings.DebugLog)
						{
							this._Log.debug(`==> POST completed data size ${tmpData.length}b received in ${this._Log.getTimeDelta(tmpRequestTime)}ms`,tmpResult);
						}
						tmpCallBack(pError, tmpResult);
					});
			});
	};
	postRecord (pRecordObject, fCallback)
	{
		this.postRecordToServer(pRecordObject, fCallback);
	};
		
	/**
	 * 
	 * DELETE RECORD
	 * 
	**/
	deleteRecordFromServer (pRecordID, fCallback)
	{
		let tmpCallBack = (typeof(fCallback) === 'function') ? fCallback : ()=>{};
		let tmpURL = this._Settings.Server+this._Settings.Entity+'/'+pRecordID;
		let tmpRequestOptions = (
		{
			url: tmpURL,
			headers: JSON.parse(JSON.stringify(this._Settings.Headers))
		});

		let tmpCookies = [];
		Object.keys(this._Settings.Cookies).forEach((pKey)=>
			{
				tmpCookies.push(this._Dependencies.cookie.serialize(pKey, this._Settings.Cookies[pKey]));
			});
		if (tmpCookies.length > 0)
			tmpRequestOptions.headers.cookie = tmpCookies.join(';');

		if (this._Settings.DebugLog)
			this._Log.debug(`Beginning DELETE request`,tmpRequestOptions);
		let tmpRequestTime = this._Log.getTimeStamp();

		this._Dependencies.simpleget.delete(tmpRequestOptions, (pError, pResponse)=>
			{
				if (pError)
				{
					return tmpCallBack(pError);
				}
				if (this._Settings.DebugLog)
					this._Log.debug(`--> DELETE connected in ${this._Log.getTimeDelta(tmpRequestTime)}ms code ${pResponse.statusCode}`);

				let tmpData = '';

				pResponse.on('data', (pChunk)=>
					{
						if (this._Settings.DebugLog)
							this._Log.debug(`--> DELETE data chunk size ${pChunk.length}b received in ${this._Log.getTimeDelta(tmpRequestTime)}ms`);
						tmpData += pChunk;
					});

				pResponse.on('end', ()=>
					{
						let tmpResult = null;
						if (tmpData)
							tmpResult = JSON.parse(tmpData);
						if (this._Settings.DebugLog)
						{
							this._Log.debug(`==> DELETE completed data size ${tmpData.length}b received in ${this._Log.getTimeDelta(tmpRequestTime)}ms`,tmpResult);
						}
						tmpCallBack(pError, tmpResult);
					});
			});
	};
	deleteRecord (pRecordID, fCallback)
	{
		this.getRecordFromServer(pRecordID, fCallback);
	};
};

module.exports = Cumulation;