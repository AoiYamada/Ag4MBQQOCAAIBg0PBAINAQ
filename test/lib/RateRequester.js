const chai = require('chai');
const assert = chai.assert;
const path = require('path');
const Config = require('config');
const RateRequester = require(path.join(Config.PATHS.LIB, 'RateRequester'));

describe('RateRequester', () => {
	it('GetRate Success', async () => {
		try {
			const rate = await RateRequester.GetRate({
				'from': 'HKD',
				'to': 'USD'
			});
			assert(typeof rate === 'number', 'Wrong data type.');
		} catch (err) {
			assert(false, err.message);
		}
	});

	it('GetRate Fail', async () => {
		try {
			const rate = await RateRequester.GetRate({
				'from': 'ABC',
				'to': 'DEF'
			});
			assert(false, 'I can\'t imagine how to reach here...');
		} catch (err) {
			if (err.message === 'Wrong Currency Code') {
				assert(true);
			} else {
				// Unexpected error throw by system
				assert(false, err.message);
			}
		}
	});
});
