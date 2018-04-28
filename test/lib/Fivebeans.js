'use strict';

const chai = require('chai');
const assert = chai.assert;
const path = require('path');
const Config = require('config');
const {
	Producer,
	Consumer
} = require(path.join(Config.PATHS.LIB, 'Fivebeans'));

// sec, default mocha timeout = 2,
// so timeout before default timeout
// TIMEOUT < 2
const TIMEOUT = 1;

describe('Fivebeans', () => {
	describe('Producer', () => {
		const producer = new Producer(Config.FIVEBEANS);

		it('Put', async () => {
			try {
				const jobid = await producer.Put(0, 0, 60, {
					type: 'exchange',
					payload: {
						'from': 'HKD',
						'to': 'USD'
					}
				});
				// console.log(jobid);
			} catch (err) {
				assert(false, err);
			}
		});

		after(() => {
			producer.Close();
		});
	});

	describe('Consumer', () => {
		const consumer = new Consumer(Config.FIVEBEANS);
		let jobid,
			payload;

		it('Reserve', async () => {
			try {
				({
					jobid,
					payload
				} = await consumer.Reserve(TIMEOUT));
				// console.log(jobid, payload);
			} catch (err) {
				assert(false, err.message);
			}
		});

		it('Destory', async () => {
			try {
				if (jobid) {
					await consumer.Destroy(jobid);
				} else {
					assert(false, `Jobid ${jobid}, something wrong`);
				}
			} catch (err) {
				assert(false, err.message);
			}
		});

		after(() => {
			consumer.Close();
		});
	});
});
