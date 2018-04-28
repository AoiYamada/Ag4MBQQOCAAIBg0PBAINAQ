'use strict';

const Config = require('config');
const path = require('path');
const ConsumerWorker = require(path.join(Config.PATHS.MODELS, 'ConsumerWorker'));

const {
	Producer,
	Consumer
} = require(path.join(Config.PATHS.LIB, 'Fivebeans'));
const producer = new Producer(Config.FIVEBEANS);
const consumer = new Consumer(Config.FIVEBEANS);

const consumer_worker = new ConsumerWorker({
	producer,
	consumer
});

async function main() {
	setTimeout(() => {
		main();
	}, Config.BEANSTALKD.CHECK_FREQUENCY * 1000);

	try {
		await consumer_worker.Consume();
	} catch (err) {
		console.log(err.message, new Date());
	}
}

main();
