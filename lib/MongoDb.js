'use strict';

const mongodb = require('mongodb');
const MC = mongodb.MongoClient;
const {
	ObjectID
} = mongodb;

/**
 * Class of MongoDb connection
 * @property {object} client - A client object returned by mongodb connection
 * @property {Promise<object>} db - A db object returned by mongo client
 */
module.exports = class MongoDb {
	/**
     * @typedef {object} MGDBConfig
     * @property {string} URL - host:port of mongo server
     * @property {object} OPTIONS
     * @property {integer} OPTIONS.poolSize - size of connection pool
     * @property {object} OPTIONS.auth - user and password for auth
     * @property {string} OPTIONS.auth.user - username
     * @property {string} OPTIONS.auth.password - password
     *
     */

	/**
     * Create a Mongodb connection
     * @param {MGDBConfig} config
     * @param {string} schema - db name
     *
     */
	constructor(MGDBConfig, schema) {
		/**
        http://mongodb.github.io/node-mongodb-native/3.0/api/MongoClient.html#.connect
        MGDBConfig Example:
        {
            "URL": "mongodb://localhost:27017",
            "OPTIONS": {
                "poolSize": 5,
                "auth": {
                    "user": "admin",
                    "password": "12345678",
                }
            }
        }
        */
		const _this = this;
		_this.db = new Promise((resolve, reject) => {
			try {
				MC.connect(
					MGDBConfig.URL,
					MGDBConfig.OPTIONS,
					(err, client) => {
						if (err) {
							reject(err);
						} else {
							_this.client = client;
							resolve(client.db(schema));
						}
					}
				);
			} catch (err) {
				reject(err);
			}
		});
	}

	/**
     * Insert array of data object into mongodb
     * @param {string} collection - collection name
     * @param {array<object>} dataAry - array of data object
     * @return {Promise<object>} result object
     *
     */
	Insert(collection, dataAry) {
		const _this = this;
		return new Promise(async (resolve, reject) => {
			try {
				const db = await _this.db;
				const _collection = db.collection(collection);
				// Insert some documents
				_collection.insertMany(
					dataAry, // dataAry is an array of Objects
					(err, result) => {
						if (err) {
							reject(err);
						} else {
							resolve(result);
						}
					}
				);
			} catch (err) {
				reject(err);
			}
		});
	}

	/**
     * Find data that match the query from db
     * @param {collection} collection - collection name
     * @param {object} [query={}] - condition to filter data from db
     * @return {Promise<object>} result object
     *
     */
	Find(collection, query = Object.create(null)) {
		const _this = this;
		return new Promise(async (resolve, reject) => {
			try {
				const db = await _this.db;
				const _collection = db.collection(collection);
				// Insert some documents
				_collection.find(query).toArray(
					(err, result) => {
						if (err) {
							reject(err);
						} else {
							resolve(result);
						}
					}
				);
			} catch (err) {
				reject(err);
			}
		});
	}

	/**
     * Remove data which match the query from db
     * @param {collection} collection - collection name
     * @param {object} [query={}] - condition to filter data from db
     * @return {Promise<object>} result object
     *
     */
	Remove(collection, query = Object.create(null)) {
		const _this = this;
		return new Promise(async (resolve, reject) => {
			try {
				const db = await _this.db;
				const _collection = db.collection(collection);
				_collection.remove(
					query,
					(err, result) => {
						if (err) {
							reject(err);
						} else {
							resolve(result);
						}
					}
				);
			} catch (err) {
				reject(err);
			}
		});
	}

	/**
     * testing
     *
     */
	Distinct(collection, field, query = Object.create(null)) {
		const _this = this;
		return new Promise(async (resolve, reject) => {
			try {
				const db = await _this.db;
				const _collection = db.collection(collection);
				// Insert some documents
				_collection.distinct(
					field,
					query,
					(err, result) => { // dataAry is an array of Objects
						if (err) {
							reject(err);
						} else {
							resolve(result);
						}
					}
				);
			} catch (err) {
				reject(err);
			}
		});
	}

	/**
     * testing
     *
     */
	List() {
		const _this = this;
		return new Promise(async (resolve, reject) => {
			try {
				const db = await _this.db;
				db.listCollections().toArray(
					(err, collections) => {
						if (err) {
							reject(err);
						} else {
							resolve(
								collections
									.filter(v => v.name.indexOf('system.') === -1)
									.map(v => v.name)
							);
						}
					}
				);
			} catch (err) {
				reject(err);
			}
		});
	}

	/**
     * Close the Mongodb connection
     *
     */
	Close() {
		const _this = this;
		return new Promise(async (resolve, reject) => {
			try {
				await _this.db;
				if (this.client) {
					this.client.close();
					delete this.client;
					delete this.db;
				}
			} catch (err) {
				reject(err);
			}
		});
	}

	/**
     * testing
     *
     */
	static get ObjectID() {
		return ObjectID;
	}
};
