'use strict';

const Config = require('config');
const path = require('path');
const Task = require(path.join(Config.PATHS.MODULES, 'Task'));

const {
	Producer,
	Consumer
} = require(path.join(Config.PATHS.LIB, 'Fivebeans'));

const CURRENCY_LIST = [
	'USD',
	'HKD',
	'JPY',
	'EUR',
	'AUD',
	'GBP',
	'SGD',
	'CNY'
];

/**
 * Abstracting the logic of a seed worker
 *
 */
module.exports = class ProducerWorker {
	/**
     * @param {object} payload
     * @param {string} payload.from - currency from
     * @param {string} payload.to - currency to
     * @param {Producer} [payload.producer=new Producer(Config.FIVEBEANS)] - connection to put jobs to tube
     * @param {Consumer} [payload.consumer=new Consumer(Config.FIVEBEANS)] - connection to get jobs from tube
     *
     */
	constructor({
		from = randomElementOfArray(CURRENCY_LIST),
		to = randomElementOfArray(CURRENCY_LIST),
		producer = new Producer(Config.FIVEBEANS),
		consumer = new Consumer(Config.FIVEBEANS)
	}) {
		this.SeedTask = new Task({
			from: from,
			to: to,
			success_count: 0,
			fail_count: 0,
			producer,
			consumer
		});
	}

	/**
     * Seed the frist job to tube
     *
     */
	Seed() {
		return this.SeedTask.Put();
	}

	/**
     * Close tube connections
     *
     */
	Destory() {
		this.SeedTask.End();
	}
};

// helper
function randomElementOfArray(arr) {
	return arr[parseInt(Math.random() * arr.length, 10)];
}
