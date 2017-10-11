var nflapi = require(__dirname + '/index.js');


nflapi.fetch().subscribe(
	x => {
		console.log("Received: ", x);
	},
	e => {
		console.log("Error: ", e);
	},
	() => {
		console.log("Cycle complete");
	});