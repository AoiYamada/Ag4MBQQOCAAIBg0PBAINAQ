'use strict';

const Core = require('./Core');

/**
 * Class of Beanstalkd Consumer
 * https://github.com/ceejbot/fivebeans
 * @property {Promise<object>} fivebeans client
 * @extends Core
 */
module.exports = class Consumer extends Core {
	/**
     * @typedef {object} FBConfig
     * @property {string} HOST - Beanstalkd server
     * @property {number} PORT - Beanstalkd server port
     * @property {string} TUBE - tube name
     *
     */

	/**
     * Create a Fivebeans connection
     * @param {FBConfig} config
     *
     */
	constructor(FBConfig) {
		super(FBConfig);

		const _this = this;
		// Without watch, can't consume jobs.
		_this.client = new Promise(async (resolve, reject) => {
			const client = await _this.client;
			client.watch(FBConfig.TUBE, err => {
				if (err) {
					reject(new Error(err));
				} else {
					resolve(client);
				}
			});
		});
	}

	/**
     * @typedef {object} Job
     * @property {string} jobid - job id in the tube
     * @property {object} payload - content of the job
     *
     */

	/**
     * Reserve a job from tube
     * @param {integer} timeout - time(sec) to wait a Job
     * @return {Promise<Job>}
     *
     */
	async Reserve(timeout) {
		const _this = this;
		const client = await _this.client;
		return new Promise((resolve, reject) => {
			client.reserve_with_timeout(timeout, (err, jobid, payload) => {
				if (err) {
					reject(new Error(err));
				} else {
					resolve({
						jobid,
						payload: JSON.parse(payload)
					});
				}
			});
		});
	}

	/**
     * Destroy the job in tube
     * @param {string} jobid - job id in the tube
     * @return {Promise<undefined>}
     *
     */
	async Destroy(jobid) {
		const _this = this;
		const client = await _this.client;
		return new Promise((resolve, reject) => {
			client.destroy(jobid, err => {
				if (err) {
					reject(new Error(err));
				} else {
					resolve();
				}
			});
		});
	}
};
