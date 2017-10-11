var nflapi = require(__dirname + '/index.js');

let options = { // options and all properties are optional
	concurrent: 1, // Number of simultaneous network requests to allow (Default: 1)
	cycle: 1000 * 60 * 3, // Delay (in milliseconds) before repeating. Do not provide or set to -1 for no cycle (Default: -1)
	filters: {
		include: ['BUF'],
		omit: ['CLE'],
		in_progress: true
	}
}

nflapi.fetch(options).subscribe(
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