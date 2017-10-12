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