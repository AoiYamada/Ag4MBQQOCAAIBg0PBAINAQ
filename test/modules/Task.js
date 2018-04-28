'use strict';

const chai = require('chai');
const assert = chai.assert;
const path = require('path');
const Config = require('config');
const Task = require(path.join(Config.PATHS.MODULES, 'Task'));

const {
	Producer,
	Consumer
} = require(path.join(Config.PATHS.LIB, 'Fivebeans'));

const producer = new Producer(Config.FIVEBEANS);
const consumer = new Consumer(Config.FIVEBEANS);

describe('Task', () => {
	const task = new Task({
		from: 'HKD',
		to: 'USD',
		success_count: 3,
		fail_count: 2,
		producer,
		consumer
	});

	it('IsContinue should true when success_count < 10 and fail_count < 3', () => {
		assert(task.IsContinue === true, 'It should be true but false');
	});

	it('IsContinue should false when success_count >= 10', () => {
		task.success_count = 10;
		task.fail_count = 2;
		assert(task.IsContinue === false, 'It should be false but true');
	});

	it('IsContinue should false when fail_count >= 3', () => {
		task.success_count = 3;
		task.fail_count = 3;
		assert(task.IsContinue === false, 'It should be false but true');
	});

	after(() => {
		task.End();
	});
});
