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
	 * Get the database instance
	 * @returns {*} The database instance
	 */
	getDatabase() {
		return db;
	}
};
