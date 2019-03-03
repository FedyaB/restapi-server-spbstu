// A mapper for employees resource

const utils = require('../../common/utils');
const constants = require('../../common/constants');
const model = require('./model');

/**
 * Get employees table from the database
 * @returns {*} LowDB chain object after employees table access
 */
function getTable() {
	return utils.getDatabase().get(constants.tables.employees);
}

module.exports = {
	/**
	 * Get multiple employees profiles in a salary descending order.
	 * Pagination and filtering is allowed.
	 * @param {int} page A current page
	 * @param {string} filter A filtering string
	 * @returns {*[]} An array of employees
	 */
	getMultiple(page, filter) {
		let table = getTable()
			.orderBy('salary', 'desc');

		if (filter) {
			table = table.filter(u => u.name === filter || u.surname === filter);
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
		const found = getTable().find(key);
		return found.value();
	},
	/**
	 * Create a new employee entry in the database
	 * @param {model.Employee} entry An employee object
	 * @returns {boolean} A new employee entry was created
	 */
	create(entry) {
		const found = getTable().find(model.keyFromEntry(entry));
		if (found.value() === undefined) {
			getTable().push(entry).write();
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
		const found = getTable().find(model.keyFromEntry(entry));
		if (found.value() === undefined) {
			return false;
		}

		found.assign(entry).write();
		return true;
	},
	/**
	 * Delete an employee
	 * @param {object} key A key object
	 * @returns {boolean} The deletion succeeded
	 */
	delete(key) {
		getTable().remove(key).write();
		return true;
	},
	/**
	 * Check if an employee exists in the database
	 * @param {object} key A key object
	 * @returns {boolean} An employee exists in the database
	 */
	exists(key) {
		const found = getTable().find(key);
		return found.value() !== undefined;
	}
};
