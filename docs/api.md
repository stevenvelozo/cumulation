# API Reference

This reference documents the surface verified against `source/Cumulation.js`, `source/Cumulation-Settings-Default.js`, `source/Cumulation-Log.js`, and `source/graph/Cumulation-GraphGet.js`.

All record methods take a Node-style `(pError, pResult)` callback as their final argument. `pResult` is the parsed JSON body of the response (or `null` when the body is empty). If no callback is supplied, a no-op is used.

## Constructor

### new Cumulation(pSettings, pScope)

Creates a client instance. `pSettings` is merged over the defaults in `Cumulation-Settings-Default.js`. `pScope` is accepted as a second argument but is not used by the constructor beyond being passed in.

The constructor wires up two members:

- `instance.log` -- a [logger](#logging) instance
- `instance.graph` -- a [graph query](graph.md) instance bound to this client

```javascript
const libCumulation = require('cumulation');

let libAnimal = new libCumulation(
	{
		Server: 'https://my.server.com/1.0/',
		Entity: 'Animal'
	});
```

## Settings

Settings come from `Cumulation-Settings-Default.js` and are overridden by the object passed to the constructor.

| Property | Type | Default | Verified Use |
|----------|------|---------|--------------|
| `Server` | String | `http://127.0.0.1:8080/` | Base URL prefix for every request. Used as-is, so it must end with a slash. |
| `Entity` | String | `Unknown` | Default entity name used to build record URLs. |
| `Cookies` | Object | `{}` | Each key/value is serialized with the `cookie` module and joined into the request `cookie` header. |
| `Headers` | Object | `{}` | Merged into the headers of every request. |
| `DebugLog` | Boolean | `false` | When `true`, emits verbose request/response logs through `instance.log`. |
| `DataModel` | Object | _(not in defaults)_ | A Stricture-style schema, `{ Tables: { ... } }`, consumed by the [graph layer](graph.md) to resolve joins. Read from settings by the graph constructor. |
| `Online` | Boolean | `false` | Declared in defaults. See [Unknowns](#unknowns). |
| `Cached` | Boolean | `true` | Declared in defaults. See [Unknowns](#unknowns). |
| `CacheExpirationTime` | Number | `300000` | Declared in defaults. See [Unknowns](#unknowns). |

## Record Methods

### getRecord(pRecordID, fCallback)

Reads a single record by ID. Alias that calls `getRecordFromServer`.

- **Verb / URL:** `GET {Server}{Entity}/{pRecordID}`

```javascript
libAnimal.getRecord(17,
	(pError, pRecord) =>
	{
		console.log(pRecord);
	});
```

### getRecordFromServer(pRecordID, fCallback)

The underlying implementation behind `getRecord`. Same verb and URL.

### getRecords(pRecordsString, fCallback)

Reads a set of records for the default entity. Alias that calls `getRecordsFromServer`, which calls `getRecordsFromServerGeneric` with the configured `Entity`.

- **Verb / URL:** `GET {Server}{Entity}s/{pRecordsString}`
- The entity name is pluralized by appending the literal character `s`.
- `pRecordsString` is appended verbatim and is expected to be a FoxHound-style filter/paging string (for example `0/100` or `FilteredTo/FBV~Name~LK~Cat/0/100`).

```javascript
libAnimal.getRecords('0/100',
	(pError, pRecords) =>
	{
		console.log(pRecords);
	});
```

### getRecordsFromServer(pRecordsString, fCallback)

The implementation behind `getRecords`. Delegates to `getRecordsFromServerGeneric` using the configured `Entity`.

### getRecordsFromServerGeneric(pEntity, pRecordsString, fCallback)

Reads a set of records for an explicit entity rather than the configured default. Used internally by the graph layer to fetch joined record sets.

- **Verb / URL:** `GET {Server}{pEntity}s/{pRecordsString}`

```javascript
libAnimal.getRecordsFromServerGeneric('Owner', '0/100',
	(pError, pRecords) =>
	{
		console.log(pRecords);
	});
```

### putRecord(pRecordObject, fCallback)

Updates a record. Alias that calls `putRecordToServer`.

- **Verb / URL:** `PUT {Server}{Entity}`
- `pRecordObject` is sent as the request body.

```javascript
libAnimal.putRecord({ IDAnimal: 17, Name: 'Rover' },
	(pError, pUpdatedRecord) =>
	{
		console.log(pUpdatedRecord);
	});
```

### putRecordToServer(pRecordObject, fCallback)

The implementation behind `putRecord`. Same verb and URL.

### postRecord(pRecordObject, fCallback)

Creates a record. Alias that calls `postRecordToServer`.

- **Verb / URL:** `POST {Server}{Entity}`
- `pRecordObject` is sent as the request body.

```javascript
libAnimal.postRecord({ Name: 'Rover' },
	(pError, pCreatedRecord) =>
	{
		console.log(pCreatedRecord);
	});
```

### postRecordToServer(pRecordObject, fCallback)

The implementation behind `postRecord`. Same verb and URL.

### deleteRecordFromServer(pRecordID, fCallback)

Deletes a record by ID.

- **Verb / URL:** `DELETE {Server}{Entity}/{pRecordID}`

```javascript
libAnimal.deleteRecordFromServer(17,
	(pError, pResult) =>
	{
		console.log('Deleted.');
	});
```

> A `deleteRecord(pRecordID, fCallback)` convenience method also exists; it delegates to `deleteRecordFromServer`.

## parseFilter(pFilter)

Normalizes a single filter value to a string. Returns the value unchanged if it is already a string, the stringified value if it is a number, and an empty string otherwise.

```javascript
libAnimal.parseFilter('Rover'); // 'Rover'
libAnimal.parseFilter(17);      // '17'
libAnimal.parseFilter({});      // ''
```

> An object-handling branch (using the `matilde` module) is present but commented out in the source, so object filters currently return `''`.

## Graph Queries

The `instance.graph` member exposes a graph-aware filtered read. It is documented separately in [Graph Queries](graph.md).

### graph.get(pEntityName, pFilterObject, fCallback)

Resolves joins from the configured `DataModel`, builds FoxHound filter URLs, and reads the matching records. The callback receives `(pError, pRecords, pValidFilters, pFinalFilters, pJoinedDataSets, pValidIdentities)`.

## Logging

`instance.log` is a console-based logger with a bunyan-like channel API. Each channel method takes a message and an optional object, which is pretty-printed as JSON.

| Method | Description |
|--------|-------------|
| `trace(pMessage, pObject)` | Log at TRACE level. |
| `debug(pMessage, pObject)` | Log at DEBUG level. |
| `info(pMessage, pObject)` | Log at INFO level. |
| `warning(pMessage, pObject)` | Log at WARNING level. |
| `error(pMessage, pObject)` | Log at ERROR level. |
| `logTime(pMessage)` | Log the current timestamp, formatted with Moment. |
| `getTimeStamp()` | Return the current epoch milliseconds. |
| `getTimeDelta(pTimeStamp)` | Return milliseconds elapsed since `pTimeStamp`. |
| `logTimeDelta(pTimeStamp, pMessage)` | Log the elapsed milliseconds since `pTimeStamp`. |

```javascript
let tmpStart = libAnimal.log.getTimeStamp();
libAnimal.log.info('Starting load');
// ... work ...
libAnimal.log.logTimeDelta(tmpStart, 'Load complete');
```

## Unknowns

The following are declared in the source but their behavior could not be verified against the code in `source/`. They are documented here rather than guessed at.

- **Caching is configured but not exercised.** The `Cached`, `CacheExpirationTime`, and `Online` settings exist in the defaults, but the record methods in `Cumulation.js` always issue an HTTP request. No caching, cache expiration, or offline path was found in the source, so these settings appear to have no effect in the current version.
- **`pScope` constructor argument.** The constructor accepts a second `pScope` argument (and the tests pass one), but it is not referenced after being received. Its intended role is not determinable from the source.
- **The `matilde` dependency.** `matilde` is listed as a dependency and referenced in commented-out code (object filter parsing), but it is not active in the current source.
