'use strict';

const Config = require('config');
const path = require('path');
const RateRequester = require(path.join(Config.PATHS.LIB, 'RateRequester'));

const MongoDb = require(path.join(Config.PATHS.LIB, 'MongoDb'));
const db = new MongoDb(Config.MONGODB, Config.MONGODB.DB);

/**
 * Abstracting the logic of connecting db, get currency rate and insert data to db
 *
 */
module.exports = class Rate {
	/**
     * @param {object} payload
     * @param {string} payload.from - currency from
     * @param {string} payload.to - currency to
     * @param {float} payload.rate - currency rate
     *
	 * payload example:
	   {
	       from,
	       to,
	       rate
	   }
     *
     */
	constructor(payload) {
		Object.assign(this, payload);
		this.created_at = new Date();
	}

	/**
     * Getting a Rate instance
     * @param {object} payload
     * @param {string} payload.from - currency from
     * @param {string} payload.to - currency to
     * @return {Rate}
     *
	 * payload example:
	   {
	       from,
	       to
	   }
     *
     */
	static async GetRate(payload) {
		try {
			const rate = await RateRequester.GetRate(payload);
			const rate_params = Object.assign({rate}, payload);

			return new Rate(rate_params);
		} catch (err) {
			throw err;
		}
	}

	/**
     * Inserting the data to db, additional key can be added to the Rate instance before calling this method
     */
	Insert() {
		const data = {
			from: this.from,
			to: this.to,
			created_at: this.created_at,
			rate: this.rate
		};
		return db.Insert(Config.MONGODB.COLLECTION, [data]);
	}

	/**
     * Close the db connection
     *
     */
	static End() {
		db.Close();
	}
};
