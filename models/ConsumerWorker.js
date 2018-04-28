'use strict';

const Config = require('config');
const path = require('path');
const Task = require(path.join(Config.PATHS.MODULES, 'Task'));
const Rate = require(path.join(Config.PATHS.MODULES, 'Rate'));

const {
	Producer,
	Consumer
} = require(path.join(Config.PATHS.LIB, 'Fivebeans'));

/**
 * Abstracting the logic of a consumer worker
 *
 */
module.exports = class ConsumerWorker {
	/**
     * @param {object} payload
     * @param {Producer} [payload.producer=new Producer(Config.FIVEBEANS)] - connection to put jobs to tube
     * @param {Consumer} [payload.consumer=new Consumer(Config.FIVEBEANS)] - connection to get jobs from tube
     *
     */
	constructor({
		producer = new Producer(Config.FIVEBEANS),
		consumer = new Consumer(Config.FIVEBEANS)
	}) {
		this.producer = producer;
		this.consumer = consumer;
	}

	/**
     * Consume a job from tube
     *
     */
	async Consume() {
		console.log('Getting task from tube...');
		const task = await Task.GetTask({
			producer: this.producer,
			consumer: this.consumer
		});

		let get_rate_success;
		try {
			console.log('Getting rate...');
			const rate = await Rate.GetRate(task);
			console.log('Inserting Data...');
			await rate.Insert();
			get_rate_success = true;
		} catch (err) {
			console.log(`Cannot get rate or insert fail, err: ${err.message}`);
			get_rate_success = false;
		}

		try {
			console.log('Destorying Task...');
			await task.Destory();

			console.log(`IsContinue: ${task.IsContinue}`);
			if (task.IsContinue) {
				console.log(`get_rate_success: ${get_rate_success}`);
				return task.Put(get_rate_success);
			}
			return task.End();
		} catch (err) {
			throw err;
		}
	}

	/**
     * Close producer and consumer connections
     *
     */
	Destory() {
		this.producer.End();
		this.consumer.End();
	}
};
