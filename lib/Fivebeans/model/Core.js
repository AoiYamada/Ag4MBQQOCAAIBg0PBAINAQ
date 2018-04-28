'use strict';

const fivebeans = require('fivebeans');

/**
 * Class of Beanstalkd connection
 * https://github.com/ceejbot/fivebeans
 * @property {Promise<object>} fivebeans client
 */
module.exports = class Core {
	/**
     * @typedef {object} FBConfig
     * @property {string} HOST - Beanstalkd server
     * @property {integer} PORT - Beanstalkd server port
     * @property {string} TUBE - tube name
     *
     */

	/**
     * Create a Fivebeans connection
     * @param {FBConfig} config
     *
     */
	constructor(FBConfig) {
		const _this = this;
		const client = new fivebeans.client(FBConfig.HOST, FBConfig.PORT);

		_this.client = new Promise((resolve, reject) => {
			client
				.on('connect', () => {
					resolve(client);
				})
				.on('error', err => {
					reject(new Error(err));
				})
				.on('close', () => {
					// The program should be crash when the connection lose,
					// or try to reconnect to the host
					// but err can't be throw inside promise(can't catch outside)
					// nor reject the promise here since it should be resolved already,
					// so I delete the client here, please handle undefined client yourself.
					delete _this.client;
				})
				.connect();
		});
	}

	/**
     * Close the Beanstalkd connection
     */
	async Close() {
		// https://nodejs.org/api/net.html#net_socket_destroy_exception
		// can't find the close connection method in fivebean's doc
		// read the source code, the connection is nodejs' net stream,
		// so socket destroy should work, shouldn't it?
		const client = await this.client;
		client.stream.destroy();
		delete this.client;
	}
};
