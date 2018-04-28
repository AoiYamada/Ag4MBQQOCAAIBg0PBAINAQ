'use strict';

const chai = require('chai');
const assert = chai.assert;
const path = require('path');
const Config = require('config');
const MongoDb = require(path.join(Config.PATHS.LIB, 'MongoDb'));

describe('MongoDb', () => {
	const test_db = new MongoDb(Config.MONGODB, 'test');

	it('Insert Data', async () => {
		try {
			const result = await test_db.Insert('testC1', [{
				testing1: {
					hi: 1,
					hihi: 2
				},
				testing2: 2
			}]);
			await test_db.Insert('testC1', [{
				testing1: 2,
				testing2: 2
			}]);
			// console.log(result.result);
		} catch (err) {
			assert(false, err.message);
		}
	});

	it('Find Data', async () => {
		try {
			const result = await test_db.Find('testC1', {
				testing1: 1,
				testing2: 2
			});
			// console.log(result);
		} catch (err) {
			assert(false, err.message);
		}
	});

	it('Remove Data', async () => {
		try {
			const result = await test_db.Remove('testC1', {
				testing1: 1,
				testing2: 2
			});
			// console.log(result.result);
		} catch (err) {
			assert(false, err.message);
		}
	});

	after(() => {
		test_db.Close();
	});
});
