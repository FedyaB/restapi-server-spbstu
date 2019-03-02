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
	fillParameters(destination, source) {
		for (const property in source) {
			if (!Object.prototype.hasOwnProperty.call(source, property)) {
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
	getDatabase() {
		return db;
	}
};
