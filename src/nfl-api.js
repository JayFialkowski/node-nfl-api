var Rx = require('rx');
var request = require('request');
var async = require('async');
var NflAPI = function () {}

NflAPI.prototype.getGame = function (id) {

}

NflAPI.prototype.fetch = function (options) {
	if (!options) options = {};
	if (!options.concurrent || !Number.isSafeInteger(options.concurrent)) options.concurrent = 1;
	if (!options.filters) options.filters = {};

	var source = Rx.Observable.create(observer => {
		request.get('http://www.nfl.com/liveupdate/scorestrip/ss.json', (error, response, body) => {
			if (error) {
				observer.onError(error);
				observer.onCompleted();
			} else {
				var games = filterGames(JSON.parse(body)['gms'], options.filters);
				var queue = async.queue(getGame, (options.concurrent ? options.concurrent : 1));
				queue.drain = () => {
					observer.onCompleted();
				}
				queue.push(games, function (result, err) {
					if (err) {
						observer.onError(err);
					} else {
						observer.onNext(result);
					}
				})
			}
		});
	});
	return source;
}

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
				payload.details = body;
				callback(payload, null);
			}
		});
	}
}

function filterGames(games, filters) {
	var g = games;
	if (filters.in_progress === true) {
		g = g.filter(function (game) {
			return Number.isInteger(game.q) || game.q == 'OT';
		});
	}
	if (filters.include) {
		g = g.filter(function (game) {
			return filters.include.indexOf(game.h) >= 0 || filters.include.indexOf(game.v) >= 0;
		})
	}
	return g;
}

module.exports = new NflAPI;