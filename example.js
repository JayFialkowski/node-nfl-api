var nfl = require(__dirname + '/index.js');

var options = {
	// interval: 10 * 1000,
	concurrent: 3,
	filters: {
		in_progress: false,
		include: ['CAR', 'MIA']
	}
}
var api = new nfl(options);
api.execute().subscribe(
	x => {
		console.log(x);
	},
	e => {
		console.log(('error: ', e));
	},
	() => {
		console.log('done.');
	}
);