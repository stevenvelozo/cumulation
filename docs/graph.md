# Graph Queries

The graph layer (`instance.graph`) lets you filter one entity by values that live on a *joined* entity, without hand-writing the filter URLs. It reads a data model, works out how entities connect, and builds the FoxHound filter strings that the plural read methods consume.

This page is verified against `source/graph/Cumulation-GraphGet.js`.

## The Data Model

The graph layer needs a `DataModel` in the client settings. It expects a Stricture-style schema with a `Tables` map, where each table has a `TableName` and a `Columns` array. Each column may declare a `Join` to another entity.

```javascript
const libCumulation = require('cumulation');

let libBook = new libCumulation(
	{
		Server: 'https://my.server.com/1.0/',
		Entity: 'Book',
		DataModel:
		{
			Tables:
			{
				Book:
				{
					TableName: 'Book',
					Columns:
					[
						{ Column: 'IDBook', DataType: 'ID' },
						{ Column: 'Title', DataType: 'String' },
						{ Column: 'IDAuthor', DataType: 'Integer', Join: 'IDAuthor' }
					]
				},
				Author:
				{
					TableName: 'Author',
					Columns:
					[
						{ Column: 'IDAuthor', DataType: 'ID' },
						{ Column: 'Name', DataType: 'String' }
					]
				}
			}
		}
	});
```

When the graph instance is constructed, it walks every table's columns and records each `Join` into an internal join map (`unfoldJoins`). A small set of audit columns is excluded from join resolution: `IDCustomer`, `CreatingIDUser`, `UpdatingIDUser`, and `DeletingIDUser`. If the `DataModel` has no `Tables` property, the graph logs a warning and join lookups will not work.

## graph.get(pEntityName, pFilterObject, fCallback)

Reads records for `pEntityName`, filtered by the properties in `pFilterObject`. The callback signature is:

```javascript
fCallback(pError, pRecords, pValidFilters, pFinalFilters, pJoinedDataSets, pValidIdentities)
```

`pRecords` is the final result set. The remaining arguments expose the intermediate state the graph computed (the parsed filters, the filters it chose to apply, the joined record sets it fetched, and the list of valid identities) and are primarily useful for debugging.

## How Filter Properties Are Interpreted

Each property in `pFilterObject` is classified into one of these filter types:

| Type | When it applies | Effect |
|------|-----------------|--------|
| `InRecordString` | The property is a `String`/`Text` column on the entity and the value is a string | Emits a `LK` (LIKE) filter on that column |
| `InRecord` | The property is a column on the entity and the value is an integer or array | Emits an `EQ` (or `INN` for arrays) filter on that column |
| `Join` | The property starts with `ID` and names another entity that joins to this one | Resolves through the joined entity to a set of matching identities |

For a property named like `IDAuthor`, the graph strips the `ID` prefix to find the target entity (`Author`) and checks its join map. String values are matched against String/Text columns on the entity for a LIKE filter.

```javascript
// Filter Books whose Title is like 'Dune' and whose Author is #5
libBook.graph.get('Book',
	{
		Title: 'Dune',
		IDAuthor: 5
	},
	(pError, pRecords) =>
	{
		console.log(pRecords);
	});
```

When a join filter can be satisfied by more than one path, the graph picks the best one using join counts, the number of incoming connections, and any caller-supplied hints (see `HINTS` below).

## Special Filter Keys

A handful of upper-case keys in `pFilterObject` are treated as directives rather than column filters. Each is removed from the filter object before normal processing.

| Key | Purpose |
|-----|---------|
| `PAGING` | `{ Page, PageSize }` controlling the paging segment of the URL. Defaults to `0/2000`. |
| `IGNORES` | A map of filter properties to skip. |
| `HINTS` | Per-filter ordered lists of preferred join entities, used to break ties when several joins are valid. |
| `FILTERS` | Per-entity extra raw FoxHound filter fragments to append. |
| `PROPERTIES` | Extended behavior flags. `ForceJoins` short-circuits to an empty result when a join filter resolves to no identities. |

```javascript
libBook.graph.get('Book',
	{
		IDAuthor: [ 5, 6, 7 ],
		PAGING: { Page: 0, PageSize: 50 },
		HINTS: { IDAuthor: [ 'Author' ] }
	},
	(pError, pRecords) =>
	{
		console.log(pRecords);
	});
```

## Generated Filter URLs

Internally the graph layer builds FoxHound filter strings and calls `getRecordsFromServerGeneric` to fetch records. The fragments it emits are:

- `FBV~{Column}~EQ~{Value}` -- filter by value, equals (scalar `InRecord`)
- `FBL~{Column}~INN~{Values}` -- filter by list, IN (array `InRecord`, and the resolved join identity list)
- `FBV~{Column}~LK~{Value}` -- filter by value, LIKE (`InRecordString`)

These are assembled under a `FilteredTo/` prefix and combined with `~`, then suffixed with the paging segment, for example:

```
FilteredTo/FBV~Title~LK~Dune~FBL~IDBook~INN~3,7,9/0/50
```

## Resolution Flow

For a request that includes join filters, `graph.get` runs an `async.waterfall` that:

1. Parses the filter object into valid filters (`parseFilterObject`).
2. Intersects each join filter's potential joins with the joins that reach the target entity, and selects the best satisfying join per filter.
3. Fetches the joined record sets for the chosen joins.
4. Reduces those sets to the intersection of valid identity values for the target entity's ID column.
5. Builds the final filter URL (the identity `INN` list plus any `InRecord`/`InRecordString`/`FILTERS` fragments and paging) and reads the target entity.

When the filter object contains no join filters, the join-resolution stages are skipped and only the direct in-record filters are applied.
