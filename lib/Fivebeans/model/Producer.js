'use strict';

const Core = require('./Core');

/**
 * Class of Beanstalkd Producer
 * https://github.com/ceejbot/fivebeans
 * @property {Promise<object>} fivebeans client
 * @extends Core
 */
module.exports = class Producer extends Core {
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
		// https://github.com/ceejbot/fivebeans/blob/master/examples/emitjobs.js
		// It called client.use before doing anything about producing, so do I.
		_this.client = new Promise(async (resolve, reject) => {
			const client = await _this.client;
			client.use(FBConfig.TUBE, err => {
				if (err) {
					reject(new Error(err));
				} else {
					resolve(client);
				}
			});
		});
	}

	/**
     * Create a Job in tube
     * @param {integer} priority - smaller integers are higher priority
     * @param {integer} delay - delay in seconds
     * @param {integer} ttr - time-to-run in seconds
     * @param {object} payload -  job data the server will return to clients reserving jobs; it can be either a Buffer object or a string. No processing is done on the data.
     * @return {Promise<string>} jobid
     *
     */
	async Put(priority, delay, ttr, payload) {
		const _this = this;
		const client = await _this.client;
		return new Promise((resolve, reject) => {
			// https://github.com/ceejbot/fivebeans/blob/master/examples/emitjobs.js
			// payload examples:
			// {
			//     type: 'reverse',
			//     payload: 'a man a plan a canal panama'
			// }
			// {
			//     type: 'emitkeys',
			//     payload: {
			//         one: 'bloop',
			//         two: 'blooop',
			//         three: 'bloooop',
			//         four: 'blooooop'
			//     }
			// }

			client.put(priority, delay, ttr, JSON.stringify(payload), (err, jobid) => {
				if (err) {
					reject(new Error(err));
				} else {
					resolve(jobid);
				}
			});
		});
	}
};
