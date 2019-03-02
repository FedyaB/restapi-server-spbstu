const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const dev = require('../../config/dev');
const constants = require('../common/constants');

const adapter = new FileSync(dev.database);
const db = low(adapter);
const defaultDatabaseLayout = {};
defaultDatabaseLayout[constants.tables.employees] = [];
db.defaults(defaultDatabaseLayout).write();

module.exports = {
	fillParameters(destination, source, overwrite) {
		for (const property in source) {
			if (overwrite || !Object.prototype.hasOwnProperty.call(destination, property)) {
				destination[property] = source[property];
			}
		}
	},
	createErrorBody(err) {
		return {
			status: err.status,
			message: err.message
		};
	},
	isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	},
	isIntegerNonNegativeNumber(n) {
		return this.isNumber(n) &&
			n === parseInt(n, 10) &&
			n >= 0;
	},
	isStringPositiveNumber(n) {
		const parsed = parseInt(n, 10);
		return !isNaN(parsed) && parsed > 0;
	},
	isValidDate(s) {
		const bits = s.split('/');
		if (bits.length !== 3) {
			return false;
		}

		const y = bits[2];
		const m = bits[1];
		const d = bits[0];

		const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		if ((!(y % 4) && y % 100) || !(y % 400)) {
			daysInMonth[1] = 29;
		}

		return !(/\D/.test(String(d))) && d > 0 && d <= daysInMonth[m - 1];
	},
	getDatabase() {
		return db;
	}
};
