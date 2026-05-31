# Cumulation

> **[&#9654; Read the Cumulation Documentation](https://fable-retold.github.io/cumulation/)** &mdash; interactive docs with the full API reference.

> A browser and Node.js client for reading and writing records against a Retold-style RESTful data endpoint.

Cumulation is a small data-access library that talks to a Meadow-style REST API. It wraps the HTTP verbs (`GET`, `PUT`, `POST`, `DELETE`) for a configured entity, manages request cookies and headers, and includes a graph query layer that resolves entity joins from a Stricture-style data model and emits FoxHound filter URLs. It runs the same code in Node.js and in the browser through a bundled shim.

## Features

- **Entity REST Client** -- read, create, update, and delete records for a configured `Entity` against a base `Server` URL
- **Single and Plural Reads** -- fetch one record by ID or a set of records via a filter/paging string
- **Cookie and Header Management** -- per-request cookies (serialized via the `cookie` module) and custom headers are attached automatically
- **Graph Query Layer** -- `cumulation.graph.get()` resolves joins between entities from a data model and builds FoxHound filter URLs for you
- **Bunyan-style Logging** -- a built-in console logger with `trace`/`debug`/`info`/`warning`/`error` channels and timing helpers
- **Browser Compatible** -- a browser shim attaches the constructor to `window.Cumulation`

## Quick Start

```javascript
const libCumulation = require('cumulation');

// Point the client at a RESTful endpoint and an entity
let libBook = new libCumulation(
	{
		Server: 'https://my.server.com/1.0/',
		Entity: 'Book'
	});

// Read a single record by ID -> GET https://my.server.com/1.0/Book/17
libBook.getRecord(17,
	(pError, pRecord) =>
	{
		console.log(pRecord);
	});

// Create a record -> POST https://my.server.com/1.0/Book
libBook.postRecord({ Title: 'Dune', Author: 'Frank Herbert' },
	(pError, pCreatedRecord) =>
	{
		console.log(pCreatedRecord);
	});
```

## Installation

```bash
npm install cumulation
```

## Configuration

Settings are passed to the constructor and merged over the defaults in `source/Cumulation-Settings-Default.js`.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `Server` | String | `http://127.0.0.1:8080/` | Base URL of the REST endpoint, with a trailing slash. |
| `Entity` | String | `Unknown` | Default entity (record set) name used to build request URLs. |
| `Cookies` | Object | `{}` | Key/value cookies serialized and sent on every request. |
| `Headers` | Object | `{}` | Custom headers merged into every request. |
| `DebugLog` | Boolean | `false` | When `true`, logs verbose request/response detail. |
| `DataModel` | Object | _(none)_ | Stricture-style schema (`{ Tables: { ... } }`) consumed by the graph layer. |
| `Online` | Boolean | `false` | Declared in defaults; see Unknowns below. |
| `Cached` | Boolean | `true` | Declared in defaults; see Unknowns below. |
| `CacheExpirationTime` | Number | `300000` | Declared in defaults; see Unknowns below. |

## API

All record methods take a Node-style `(pError, pResult)` callback. `pResult` is the parsed JSON body of the response.

| Method | Description |
|--------|-------------|
| `getRecord(pRecordID, fCallback)` | GET a single record by ID. Alias of `getRecordFromServer`. |
| `getRecords(pRecordsString, fCallback)` | GET a set of records for the default entity using a filter/paging string. |
| `getRecordsFromServerGeneric(pEntity, pRecordsString, fCallback)` | GET a set of records for an explicit entity. |
| `putRecord(pRecordObject, fCallback)` | PUT (update) a record. Alias of `putRecordToServer`. |
| `postRecord(pRecordObject, fCallback)` | POST (create) a record. Alias of `postRecordToServer`. |
| `deleteRecordFromServer(pRecordID, fCallback)` | DELETE a record by ID. |
| `parseFilter(pFilter)` | Normalize a filter value to a string (passthrough for strings, stringifies numbers). |
| `graph.get(pEntityName, pFilterObject, fCallback)` | Graph-aware filtered read. See [Graph Queries](docs/graph.md). |
| `log.trace/debug/info/warning/error(pMessage, pObject)` | Console logging channels. |

See the [API Reference](docs/api.md) for full signatures, URL construction, and behavior notes.

## How It Works

A Cumulation instance is bound to one base `Server` and a default `Entity`. The record methods build URLs from those values:

```
getRecord(id)           -> GET    {Server}{Entity}/{id}
getRecords(filter)      -> GET    {Server}{Entity}s/{filter}
putRecord(record)       -> PUT    {Server}{Entity}
postRecord(record)      -> POST   {Server}{Entity}
deleteRecordFromServer  -> DELETE {Server}{Entity}/{id}
```

The plural read pluralizes the entity by appending `s` to the entity name. The graph layer (`cumulation.graph`) goes further: given a `DataModel`, it works out which entities join to one another and assembles FoxHound filter URLs so a caller can filter one entity by values that live on a joined entity.

## Documentation

Detailed documentation is available in the `docs/` folder:

| Document | Description |
|----------|-------------|
| [Quick Start](docs/quickstart.md) | Configure a client and run reads and writes |
| [API Reference](docs/api.md) | Verified method signatures, URL construction, and settings |
| [Graph Queries](docs/graph.md) | Join resolution and FoxHound filter URLs via `graph.get` |

## Building

```bash
gulp minified   # browser bundle -> dist/cumulation.min.js (+ sourcemap)
gulp debug      # unminified browser bundle -> dist/cumulation.js

# or both at once
gulp build
```

## Testing

```bash
npm test
```

## Related Modules

- [fable](https://fable-retold.github.io/fable/) - Application services framework

## License

MIT

## Contributing

Pull requests are welcome. For details on our code of conduct, contribution process, and testing requirements, see the [Retold Contributing Guide](https://github.com/stevenvelozo/retold/blob/main/docs/contributing.md).
