
# TimeHash 

A JavaScript module for a memory based key/value store that discards keys/values that have sat around too long.

## Install

	npm install timehash

## Introduction

The `TimeHash` library creates a hash table that associates data items with their TTL values. When data is added to the hash table, it is associated with a unique identifier (id) and a time-to-live value (ttl) in milliseconds. The data will automatically expire and be removed from the hash table when its TTL is reached.

## Constructor

The `TimeHash` constructor accepts an optional configuration object (`_opts`) with the following properties:

- `scan_interval`: The interval in milliseconds at which the library scans for expired items. The default value is 10,000 milliseconds (10 seconds).
- `refresh_on_get`: A boolean indicating whether to refresh the TTL of an item when it is retrieved using the `get` method. The default value is `false`.

## Methods

### get

The `get` method retrieves the data associated with a given id from the `TimeHash`.

```javascript
const payload = TimeHash.get(id);
```

- `id` (String): The unique identifier of the item you want to retrieve.
- Returns the data associated with the id, or `undefined` if the item does not exist or has expired.
- If the `refresh_on_get` option is set to `true`, the TTL of the item is refreshed when it is retrieved using this method.

### rem

The `rem` method removes and returns the data associated with a given id from the `TimeHash`.

```javascript
const payload = TimeHash.rem(id);
```

- `id` (String): The unique identifier of the item you want to remove.
- Returns the data associated with the id, or `undefined` if the item does not exist or has expired.

### put

The `put` method inserts a new item into the `TimeHash`.

```javascript
const oldPayload = TimeHash.put(id, payload, ttl, on_expire);
```

- `id` (String): A unique identifier for the item.
- `payload` (Any): The data you want to associate with the id.
- `ttl` (Number, optional): The time-to-live value in milliseconds for the item. It should not be less than 10,000 milliseconds (10 seconds). If not provided, the default TTL is 60,000 milliseconds (60 seconds).
- `on_expire` (Function, optional): A callback function that will be called when the item expires.

The `put` method returns the previous data associated with the id, or `undefined` if there was no previous data.

### keys

The `keys` method returns an array of all the unique identifiers (ids) currently stored in the `TimeHash`.

```javascript
const allKeys = TimeHash.keys();
```

- Returns an array of strings representing the unique identifiers (ids) of the items in the hash.

## Usage

Here's an example of how to use the `TimeHash` library:

```javascript
// Create a new TimeHash instance
const timeHash = new TimeHash();

// Insert an item with a TTL of 30 seconds
timeHash.put("item1", "Data for Item 1", 30000);

// Retrieve the data associated with "item1"
const item1Data = timeHash.get("item1");
console.log(item1Data); // Output: "Data for Item 1"

// Wait for 31 seconds to let the item expire

// Attempt to retrieve the expired item
const expiredItemData = timeHash.get("item1");
console.log(expiredItemData); // Output: undefined
```

## Node.js and Browser Support

The `TimeHash` library is designed to work in both Node.js and browser environments. It checks the environment and exports the module accordingly:

- In Node.js, it exports the `TimeHash` constructor as a module.
- In a browser, it assigns `TimeHash` to the `globalThis` object, making it available globally.

This allows you to use the library seamlessly in both server-side and client-side JavaScript applications.

**Note**: If you are using the library in Node.js, you can also run the included test file using `require("./test.js")` when executing the script as the main module.

