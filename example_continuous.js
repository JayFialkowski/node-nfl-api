var nflapi = require(__dirname + '/index.js');

let options = { // options and all properties are optional
	concurrent: 1, // Number of simultaneous network requests to allow (Default: 1)
	cycle: 1000 * 60 * 3, // Delay (in milliseconds) before repeating. Do not provide or set to -1 for no cycle (Default: -1)
	filters: {
		include: ['BUF'],
		in_progress: false
	}
}

fetch(options, 1000 * 5);

/**
 * fetch - Call the API's fetch function, passing in options and the interval between cycles (in ms)
 * 
 * @param {any} options 
 * @param {any} interval 
 */
function fetch(options, interval) {
	nflapi.fetch(options).subscribe(
		x => {
			console.log("Received: ", x);
		},
		e => {
			console.log("Error: ", e);
		},
		() => {
			console.log(`Cycle complete. Cycling again in ${interval}ms.`);
			setTimeout(function () {
				fetch(options, interval);
			}, interval);
		});
}