var Rx = require('rx');
var request = require('request');
var async = require('async');
var NflAPI = function () {}

NflAPI.prototype.test = function () {
	console.log('hi');
}

NflAPI.prototype.getGame = function (id) {

}
/**
 * fetch
 * @param options {object} - Optional parameter. 
 *  - concurrent - Number of concurrent network requests to allow at a time (default: 1)
 * 
 * TODO: cycle_time
 * TODO: cycle_iterations
 * TODO: whitelist
 */
NflAPI.prototype.fetch = function (options) {
	if (!options.concurrent || !Number.isSafeInteger(options.concurrent)) options.concurrent = 1;
	var source = Rx.Observable.create(observer => {
		request.get('http://www.nfl.com/liveupdate/scorestrip/ss.json', (error, response, body) => {
			if (error) {
				observer.onError(error);
				observer.onCompleted();
			} else {
				var games = JSON.parse(body)['gms'];
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
		request.get("http://www.nfl.com/liveupdate/game-center/2017100200/2017100200_gtd.json", function (error, response, body) {
			if (error) callback(payload, error);
			else {
				payload.details = body;
				callback(payload, null);
			}
		});
	}
}

module.exports = new NflAPI;