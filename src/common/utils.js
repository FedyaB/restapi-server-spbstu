const _ = require('lodash');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const defaultProperties = require('../../config/default');
const dev = require('../../config/dev');
const constants = require('../common/constants');

// Fill not specified parameters in dev from default parameters
const properties = defaultProperties;
_.assign(properties, dev);

// Create the database instance once
const adapter = new FileSync(properties.database);
const db = low(adapter);
const defaultDatabaseLayout = {};
defaultDatabaseLayout[constants.tables.employees] = [];
db.defaults(defaultDatabaseLayout).write();

module.exports = {
	/**
	 * Get current config parameters
	 * @returns {object} Config parameters
	 */
	getConfigParameters() {
		return properties;
	},
	/**
	 * Create a custom error object from the http-errors error object
	 * @param {object} err http-errors error object
	 * @returns {{message: *, status: *}} Custom error object
	 */
	createErrorBody(err) {
		return {
			status: err.status,
			message: err.message
		};
	},
	/**
	 * Check if the parameter is a number indeed
	 * @param {*} n A parameter to be checked
	 * @returns {boolean} The parameter is a number
	 */
	isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	},
	/**
	 * Check if the parameter is an integer and non-negative number
	 * @param {*} n A parameter to be checked
	 * @returns {*|boolean} The parameter is an integer and non-negative number
	 */
	isIntegerNonNegativeNumber(n) {
		return this.isNumber(n) &&
			n === parseInt(n, 10) &&
			n >= 0;
	},
	/**
	 * Check if the parameter can be parsed as a positive number
	 * @param {string} s A string to be parsed
	 * @returns {boolean} The parameter cam be parsed as a positive number
	 */
	isStringPositiveNumber(s) {
		const parsed = parseInt(s, 10);
		return !isNaN(parsed) && parsed > 0;
	},
	/**
	 * Check if the parameter is a string with a valid date in it
	 * @param {string} s A string that contains a date
	 * @returns {boolean} The parameter contains valid date
	 */
	isValidDate(s) {
		const bits = s.split('/');
		if (bits.length !== 3) {
			return false;
		}

		const y = bits[2];
		const m = bits[1];
		const d = bits[0];

		const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		// Check for a leap year
		if ((!(y % 4) && y % 100) || !(y % 400)) {
			daysInMonth[1] = 29;
		}

		return !(/\D/.test(String(d))) && d > 0 && d <= daysInMonth[m - 1];
	},
	/**
	 * Get the database instance
	 * @returns {*} The database instance
	 */
	getDatabase() {
		return db;
	}
};
