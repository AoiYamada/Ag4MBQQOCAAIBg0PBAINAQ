'use strict';

/** Notes
 * https://www.xe.com/currencyconverter/convert/?Amount=1&From=HKD&To=USD
 * rate is $('.uccResultAmount').text()
 * It could be wrong when the frontend changed
 */

const cheerio = require('cheerio');
const https = require('https');
const url = require('url');

const BASE_URL_OBJECT = {
	protocol: 'https',
	hostname: 'www.xe.com',
	pathname: '/currencyconverter/convert/',
	query: {}
};

/**
 * Static class for abstracting the logic of requesting currency rate
 *
 */
module.exports = class RateRequester {
	/**
     * Get currency rate from xe.com
     * @param {string} from - origin currency code
     * @param {string} to - target currency code
     * @return {float} currency rate correct to 2 decimal place
     *
     */
	static GetRate({
		from,
		to
	}) {
		const request_url_object = Object.assign({}, BASE_URL_OBJECT);
		request_url_object.query = {
			From: from,
			To: to,
			Amount: 1
		};

		const request_url = url.format(request_url_object);

		return new Promise(async (resolve, reject) => {
			getHtml(request_url)
				.then(html => {
					const [rate, _from, _to] = extractRate(html);
					if (_from.indexOf(from) !== -1 && _to.indexOf(to) !== -1) {
						resolve(rate);
					} else {
						reject(new Error('Wrong Currency Code'));
					}
				})
				.catch(err => {
					reject(err);
				});
		});
	}
};

// helpers:
/**
 * Get html from _url
 * https://nodejs.org/api/https.html#https_https_get_options_callback
 * https://nodejs.org/api/https.html#https_https_get_options_callback
 * @param {string} _url - target url
 * @return {string} html of the target page
 */
function getHtml(_url) {
	return new Promise((resolve, reject) => {
		https.get(_url, res => {
			const {
				statusCode
			} = res;
			const contentType = res.headers['content-type'];

			let error;
			if (statusCode !== 200) {
				error = new Error('Request Failed. ' +
                    `Status Code: ${statusCode}`);
			} else if (!/^text\/html/.test(contentType)) {
				error = new Error('Invalid content-type. ' +
                    `Expected text/html but received ${contentType}`);
			}
			if (error) {
				reject(error);
				// consume response data to free up memory
				res.resume();
				return;
			}

			res.setEncoding('utf8');
			let html = '';
			res.on('data', chunk => {
				html += chunk;
			});
			res.on('end', () => {
				resolve(html);
			});
		}).on('error', err => {
			reject(err);
		});
	});
}

/**
 * Get rate from html of xe.com
 * @param {string} html
 * @param {integer} [precision=2] - correct to {precision} decimal place
 * @return {float} html of the target page
 */
function extractRate(html, precision = 2) {
	const $ = cheerio.load(html);
	const rate_str = $('.uccResultAmount').text();
	const _from = $('.uccFromResultAmount').text();
	const _to = $('.uccToCurrencyCode').text();

	const rounded_rate = precisionRound(rate_str, precision);
	return [rounded_rate, _from, _to];
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
function precisionRound(number, precision) {
	const factor = Math.pow(10, precision);
	return Math.round(number * factor) / factor;
}
