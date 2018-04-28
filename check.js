'use strict';

const path = require('path');
const Config = require('config');
const MongoDb = require(path.join(Config.PATHS.LIB, 'MongoDb'));

const {
	Consumer
} = require(path.join(Config.PATHS.LIB, 'Fivebeans'));
const consumer = new Consumer(Config.FIVEBEANS);

(async () => {
	const db = new MongoDb(Config.MONGODB, Config.MONGODB.DB);
	const result = await db.Find(Config.MONGODB.COLLECTION);
	console.log('Exchange rates:');
	console.log(result);
	db.Close();

	try {
		const {
			jobid,
			payload
		} = await consumer.Reserve(1);
		console.log('Job:');
		console.log(jobid, payload);
	} catch (err) {
		console.log(err.message);
	}
	consumer.Close();
})();
