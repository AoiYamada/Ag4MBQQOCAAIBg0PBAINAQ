'use strict';

const Config = require('config');
const path = require('path');
const ProducerWorker = require(path.join(Config.PATHS.MODELS, 'ProducerWorker'));

(async () => {
	const producer_worker = new ProducerWorker({});

	try {
		await producer_worker.Seed();
		console.log('Seeded!');
	} catch (err) {
		console.log(err);
	}

	producer_worker.Destory();
})();
