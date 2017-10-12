# Node NFL API

A simple module for asychnronously fetching the current week's NFL data.

### Installation

You will need to include node-nfl-api in your project

```
npm i node-nfl-api --save
```

### Basic example

```
var nfl = require(__dirname + '/index.js');

var options = {
	interval: 10 * 1000,
	concurrent: 2,
	filters: {
		in_progress: false,
		include: ['BUF', 'NE', 'MIA', 'NYJ']
	}
}
var api = new nfl(options);
api.execute().subscribe(
	x => {
		console.log("New Item", x);
	},
	e => {
		console.log('ERROR', e);
	},
	() => {
		console.log('Subsription terminated.');
	}
);
```

### Options
When fetching NFL data, you may pass an *options* object as a parameter. This object is optional, as are **all** of its properties. Below is the structure of the options object.
```
var options = {
	interval: 60 * 1000, // Delay (in millis) before beginning another cycle. Use this for a perpetual subscription. Default is unset (no cycling)
	concurrent: 1, // Number of simultaneous network requests to allow. Default is 1.
	filters: {
		in_progress: true, // Only fetch games which are currently in progress. Default is false.
		include: ['BUF', 'NYJ', 'MIA', 'NE'] // Only fetch games involving a team in the provided array
	}
}
```

## Change Log
### 1.1.0
* Refactored to allow for perpetual subscriptions

### 1.0.3
* Implement options filtering (in_progress, include)

## Built With

* [Reactive (RX)](https://www.npmjs.com/package/rx)
* [Request](https://www.npmjs.com/package/request)
* [Async](https://www.npmjs.com/package/async)

## Authors

* **Jay Fialkowski**

## License

This project is free to use.
