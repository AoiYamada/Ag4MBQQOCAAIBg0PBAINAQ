'use strict';

const Config = require('config');
const path = require('path');
const TaskConfig = Config.BEANSTALKD;
// TaskConfig example:
// {
//     "SUCCESS_COUNT_UPPER_BOUND": 10,
//     "FAIL_COUNT_UPPER_BOUND": 3,
//     "SUCCESS_WAIT_TIME": 60000,
//     "FAIL_WAIT_TIME": 3000,
//     "TIMEOUT": 1
// }

const {
	Producer,
	Consumer
} = require(path.join(Config.PATHS.LIB, 'Fivebeans'));

module.exports = class Task {
	/**
     * @param {object} payload
     * @param {string} payload.from - currency from
     * @param {string} payload.to - currency to
     * @param {string} payload.success_count - counter for success get rate
     * @param {string} payload.fail_count - counter for fail get rate
     * @param {integer} payload.jobid - for deleting the job when it finished
     * @param {Producer} payload.producer - connection to put jobs to tube
     * @param {Consumer} payload.consumer - connection to get jobs from tube
     *
	 * payload example:
	 * {
	       from,
	       to,
	       success_count,
	       fail_count,
	       jobid,
	       producer,
	       consumer
	   }
     *
     */
	constructor(payload) {
		Object.assign(this, payload);
	}

	/**
     * Getting a Task instance
     * @param {object} payload
     * @param {Producer} [payload.producer=new Producer(Config.FIVEBEANS)] - connection to put jobs to tube
     * @param {Consumer} [payload.consumer=new Consumer(Config.FIVEBEANS)] - connection to get jobs from tube
     *
     */
	static async GetTask({
		producer = new Producer(Config.FIVEBEANS),
		consumer = new Consumer(Config.FIVEBEANS)
	}) {
		try {
			const {
				jobid,
				payload
			} = await consumer.Reserve(TaskConfig.TIMEOUT);

			const task_params = Object.assign(
				{
					jobid,
					producer,
					consumer
				},
				payload
			);

			return new Task(task_params);
		} catch (err) {
			throw err;
		}
	}

	/**
     * Put the task to the tube.
     * If success the task wait {TaskConfig.SUCCESS_WAIT_TIME},
     * if fail the task wait {TaskConfig.WAIL_WAIT_TIME},
     * and success_count/fail_count increase respectively
     * @param {boolean} success - Indicate the last job sucess or not
     *
     */
	Put(success) {
		let delay = 0;

		switch (success) {
			case true:
				delay = TaskConfig.SUCCESS_WAIT_TIME;
				this.success_count++;
				break;
			case false:
				this.fail_count++;
				delay = TaskConfig.FAIL_WAIT_TIME;
				break;
			default:
		}

		const payload = {
			from: this.from,
			to: this.to,
			success_count: this.success_count,
			fail_count: this.fail_count
		};

		if (this.jobid) {
			payload.jobid = this.jobid;
		}

		return this.producer.Put(0, delay, TaskConfig.TTR, payload);
	}

	/**
     * Delete the job from tube
     *
     */
	async Destory() {
		try {
			if (this.jobid) {
				await this.consumer.Destroy(this.jobid);
				delete this.jobid;
			} else {
				console.log('No jobid, it is a seed task or deleted before.');
			}
		} catch (err) {
			throw err;
		}
	}

	/**
     * Close producer and consumer connections
     *
     */
	End() {
		this.producer.Close();
		this.consumer.Close();
	}

	/**
     * Property to determine whether to put a new job to the tube
     *
     */
	get IsContinue() {
		const success_not_enough = this.success_count < TaskConfig.SUCCESS_COUNT_UPPER_BOUND;
		const fail_not_enough = this.fail_count < TaskConfig.FAIL_COUNT_UPPER_BOUND;
		return success_not_enough && fail_not_enough;
	}
};
