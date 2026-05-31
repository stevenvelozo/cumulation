# Quick Start

This guide walks through configuring a Cumulation client and running reads and writes against a RESTful data endpoint.

## Installation

```bash
npm install cumulation
```

## Creating a Client

A Cumulation instance is bound to one base `Server` URL and a default `Entity`. Both are passed in the settings object to the constructor.

```javascript
const libCumulation = require('cumulation');

let libBook = new libCumulation(
	{
		Server: 'https://my.server.com/1.0/',
		Entity: 'Book'
	});
```

The settings you pass are merged over the library defaults, so you only need to specify what differs. If you provide nothing, the client points at `http://127.0.0.1:8080/` for an entity named `Unknown`.

## Reading a Single Record

`getRecord` fetches one record by its ID. The URL is built as `{Server}{Entity}/{id}`.

```javascript
// GET https://my.server.com/1.0/Book/17
libBook.getRecord(17,
	(pError, pRecord) =>
	{
		if (pError)
		{
			return console.error(pError);
		}

		console.log(pRecord);
	});
```

Every record method uses a Node-style `(pError, pResult)` callback. `pResult` is the parsed JSON body of the response.

## Reading a Set of Records

`getRecords` fetches a set of records for the default entity. Note that the entity name is pluralized by appending `s`, and the argument is appended to the URL as a filter/paging string.

```javascript
// GET https://my.server.com/1.0/Books/0/100
libBook.getRecords('0/100',
	(pError, pRecords) =>
	{
		console.log(`Loaded ${pRecords.length} books.`);
	});
```

The filter/paging string follows the FoxHound URL convention used by Meadow endpoints. To build filtered reads across joined entities without writing those strings by hand, use the [graph layer](graph.md).

## Creating and Updating Records

`postRecord` creates a record (`POST {Server}{Entity}`) and `putRecord` updates one (`PUT {Server}{Entity}`). Both send the record object as the request body.

```javascript
// Create -> POST https://my.server.com/1.0/Book
libBook.postRecord({ Title: 'Dune', Author: 'Frank Herbert' },
	(pError, pCreatedRecord) =>
	{
		console.log('Created:', pCreatedRecord);

		// Update -> PUT https://my.server.com/1.0/Book
		pCreatedRecord.Author = 'F. Herbert';
		libBook.putRecord(pCreatedRecord,
			(pError, pUpdatedRecord) =>
			{
				console.log('Updated:', pUpdatedRecord);
			});
	});
```

## Deleting a Record

`deleteRecordFromServer` removes a record by ID (`DELETE {Server}{Entity}/{id}`).

```javascript
// DELETE https://my.server.com/1.0/Book/17
libBook.deleteRecordFromServer(17,
	(pError, pResult) =>
	{
		console.log('Deleted.');
	});
```

## Sending Cookies and Headers

Cookies and headers configured in settings are attached to every request automatically. Cookies are serialized with the `cookie` module and joined into the `cookie` header.

```javascript
let libSecureBook = new libCumulation(
	{
		Server: 'https://my.server.com/1.0/',
		Entity: 'Book',
		Cookies: { UserSession: 'abc123' },
		Headers: { 'X-API-Key': 'super-secret' }
	});
```

## Turning On Debug Logging

Set `DebugLog` to `true` to log verbose request and response detail (connection time, chunk sizes, parsed bodies) through the built-in logger.

```javascript
let libBookDebug = new libCumulation(
	{
		Server: 'https://my.server.com/1.0/',
		Entity: 'Book',
		DebugLog: true
	});
```

## Browser Usage

When the library is bundled for the browser (via `gulp build`), the browser shim attaches the constructor to `window.Cumulation`, so it is available globally without a `require`.

```javascript
let libBook = new Cumulation(
	{
		Server: 'https://my.server.com/1.0/',
		Entity: 'Book'
	});
```

## Next Steps

- [API Reference](api.md) -- every method, its URL construction, and settings
- [Graph Queries](graph.md) -- filter one entity by values on a joined entity
