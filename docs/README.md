# Cumulation

> A browser and Node.js client for reading and writing records against a Retold-style RESTful data endpoint.

Cumulation is a small data-access library that talks to a Meadow-style REST API. It wraps the HTTP verbs (`GET`, `PUT`, `POST`, `DELETE`) for a configured entity, manages request cookies and headers, and includes a graph query layer that resolves entity joins from a data model and emits FoxHound filter URLs. The same code runs in Node.js and in the browser through a bundled shim.

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
```

## Installation

```bash
npm install cumulation
```

## Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `Server` | String | `http://127.0.0.1:8080/` | Base URL of the REST endpoint, with a trailing slash. |
| `Entity` | String | `Unknown` | Default entity (record set) name used to build request URLs. |
| `Cookies` | Object | `{}` | Key/value cookies serialized and sent on every request. |
| `Headers` | Object | `{}` | Custom headers merged into every request. |
| `DebugLog` | Boolean | `false` | When `true`, logs verbose request/response detail. |
| `DataModel` | Object | _(none)_ | Stricture-style schema (`{ Tables: { ... } }`) consumed by the graph layer. |

See the [API Reference](api.md) for the full settings list, including declared-but-unverified options.

## Documentation

- [Quick Start](quickstart.md) -- configure a client and run reads and writes
- [API Reference](api.md) -- verified method signatures, URL construction, and settings
- [Graph Queries](graph.md) -- join resolution and FoxHound filter URLs via `graph.get`

## Related Modules

- [fable](https://fable-retold.github.io/fable/) - Application services framework
