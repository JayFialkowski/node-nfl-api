# Node NFL API

A simple module for asychnronously fetching the current week's NFL data.

### Installation

You will need to include node-nfl-api in your project

```
npm i node-nfl-api --save
```

### Basic example

```
var nflapi = require('node-nfl-api');

nflapi.fetch().subscribe(
	x => {
		console.log("Received: ", x);
	},
	e => {
		console.log("Error: ", e);
	},
	() => {
		console.log('done');
	}
);
```

## Built With

* [Reactive (RX)](https://www.npmjs.com/package/rx)
* [Request](https://www.npmjs.com/package/request)
* [Async](https://www.npmjs.com/package/async)

## Authors

* **Jay Fialkowski**

## License

This project is free to use.
