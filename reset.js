'use strict';

const path = require('path');
const Config = require('config');
const MongoDb = require(path.join(Config.PATHS.LIB, 'MongoDb'));

const {Consumer} = require(path.join(Config.PATHS.LIB, 'Fivebeans'));
const consumer = new Consumer(Config.FIVEBEANS);

(async () => {
	const db = new MongoDb(Config.MONGODB, Config.MONGODB.DB);
	await db.Remove(Config.MONGODB.COLLECTION);

	const result = await db.Find(Config.MONGODB.COLLECTION);
	console.log('Exchange rates:');
	console.log(result);
	db.Close();

	try {
		let jobid;
		// let payload;
		do {
			const job = await consumer.Reserve(1);
			console.log('Job:');
			console.log(job);

			({
				jobid
				// payload
			} = job);
			if (jobid);
			await consumer.Destroy(jobid);
		} while (jobid !== undefined);
	} catch (err) {
		console.log(err.message);
	}
	consumer.Close();
})();
