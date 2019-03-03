// A mapper for employees resource

const utils = require('../../common/utils');
const constants = require('../../common/constants');
const model = require('./model');

module.exports = {
	/**
	 * Get multiple employees profiles in a salary descending order.
	 * Pagination and filtering is allowed.
	 * @param {int} page A current page
	 * @param {string} filter A filtering string
	 * @returns {*[]} An array of employees
	 */
	getMultiple(page, filter) {
		let table = utils.getDatabase()
			.get(constants.tables.employees)
			.orderBy('salary', 'desc');

		if (filter) {
			table = table.filter(u => u.name === filter || u.surname === filter); // TODO Check case insensitivity
		}

		const value = table.value();
		const array = Array.isArray(value) ? value : [value];
		return array.slice(constants.pageEntries * (page - 1), constants.pageEntries * page);
	},
	/**
	 * Get an employee by its' key
	 * @param {object} key A key object
	 * @returns {model.Employee} An employee object
	 */
	get(key) {
		const db = utils.getDatabase();
		const normalizedKey = model.normalizeEntry(key);
		const found = db.get(constants.tables.employees).find(normalizedKey);
		return found.value();
	},
	/**
	 * Create a new employee entry in the database
	 * @param {model.Employee} entry An employee object
	 * @returns {boolean} A new employee entry was created
	 */
	create(entry) {
		const db = utils.getDatabase();
		const normalizedEntry = model.normalizeEntry(entry);
		const found = db.get(constants.tables.employees).find(model.keyFromEntry(normalizedEntry));
		if (found.value() === undefined) {
			db.get(constants.tables.employees).push(normalizedEntry).write();
			return true;
		}

		return false;
	},
	/**
	 * Modify an existing employee entry
	 * @param {model.Employee} entry Existing employee entry
	 * @returns {boolean} An employee was found and modified
	 */
	modify(entry) {
		const db = utils.getDatabase();
		const normalizedEntry = model.normalizeEntry(entry);
		const found = db.get(constants.tables.employees).find(model.keyFromEntry(normalizedEntry));
		if (found.value() === undefined) {
			return false;
		}

		found.assign(normalizedEntry).write();
		return true;
	},
	/**
	 * Delete an employee
	 * @param {object} key A key object
	 * @returns {boolean} The deletion succeeded
	 */
	delete(key) {
		const db = utils.getDatabase();
		const normalizedKey = model.normalizeEntry(key);
		db.get(constants.tables.employees).remove(normalizedKey).write();
		return true;
	},
	/**
	 * Check if an employee exists in the database
	 * @param {object} key A key object
	 * @returns {boolean} An employee exists in the database
	 */
	exists(key) {
		const db = utils.getDatabase();
		const normalizedKey = model.normalizeEntry(key);
		const found = db.get(constants.tables.employees).find(normalizedKey);
		return found.value() !== undefined;
	}
};
