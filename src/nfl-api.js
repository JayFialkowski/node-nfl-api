var Rx = require('rx');
var request = require('request');
var async = require('async');

var cached_options = {
	/*
	interval: int,
	new_content: boolean,
	concurrent: int,
	filters: {
		in_progress: boolean,
		include: Array<string>
	}
	*/
};
var NflAPI = function (options) {
	if (options) cached_options = options
}

NflAPI.prototype.execute = function (options) {
	obs = new Rx.Observable.create(observer => {
		refresh(observer);
	});
	return obs;
}























///////////// INTERNAL FUNCTIONS //////////////

/**
 * refresh
 *  - This function triggers a fetch cycle.
 * 		1. Grab metadata for current week's games
 * 		2. Apply filters per game
 * 		3. Repeat as necessary
 * 
 * @param {Observable} observer 
 */
function refresh(observer) {
	request.get('http://www.nfl.com/liveupdate/scorestrip/ss.json', (error, response, body) => {
		if (error) {
			observer.onError(error);
		} else {
			var games = filterGames(JSON.parse(body)['gms']);
			var queue = async.queue(getGame, (Number.isSafeInteger(cached_options.concurrent) ? cached_options.concurrent : 1));
			queue.drain = () => {
				if (cached_options.interval && Number.isSafeInteger(cached_options.interval)) {
					setTimeout(() => {
						refresh(observer);
					}, cached_options.interval);
				} else {
					observer.onCompleted();
				}
			};
			queue.push(games, (r, e) => {
				if (e) observer.onError(e);
				else observer.onNext(r);
			});
		}
	});
}

/**
 * getGame - Accepts a game's metadata and fetches the details from NFL, returns via callback
 * 
 * @param {Object} meta 
 * @param {Function} callback 
 */
function getGame(meta, callback) {
	var payload = {
		meta: meta,
		details: {}
	}
	if (!meta || !meta.eid) callback(payload, "NO_META_EID")
	else {
		request.get(`http://www.nfl.com/liveupdate/game-center/${meta.eid}/${meta.eid}_gtd.json`, function (error, response, body) {
			if (error) callback(payload, error);
			else {
				if (response.statusCode == 404) payload.details = {};
				else payload.details = JSON.parse(body);
				callback(payload, null);
			}
		});
	}
}


/**
 * filterGames - Accepts an array of metadata for games, filters out games based on cached options
 * 
 * @param {Array<Object>} games 
 * @returns {Object}
 */
function filterGames(games) {
	var g = games;
	if (!cached_options.filters) cached_options.filters = {};
	if (cached_options.filters.in_progress === true) {
		g = g.filter(function (game) {
			return Number.isInteger(game.q) || game.q == 'OT';
		});
	}
	if (cached_options.filters.include) {
		g = g.filter(function (game) {
			return cached_options.filters.include.indexOf(game.h) >= 0 || cached_options.filters.include.indexOf(game.v) >= 0;
		})
	}
	return g;
}

module.exports = NflAPI;