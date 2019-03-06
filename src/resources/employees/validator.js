// A validator for employees resource

const _ = require('lodash');

const utils = require('../../common/utils');
const constants = require('../../common/constants');

module.exports = {
	/**
	 * Check if a parameter is a valid name
	 * @param {*} name A name
	 * @returns {boolean} A name is valid
	 */
	validateName(name) {
		return typeof name === 'string' && name.length > 0 && name.length <= 100;
	},
	/**
	 * Check if a string is a valid birthday date
	 * @param {string} birthday A birthday
	 * @returns {*|boolean} A birthday is valid
	 */
	validateBirthday(birthday) {
		return utils.isValidDate(birthday);
	},
	/**
	 * Check if a position is valid
	 * @param {*} position A position
	 * @returns {boolean} A position is valid
	 */
	validatePosition(position) {
		return _.some(constants.positions, function (element) {
			return element === position;
		});
	},
	/**
	 * Check if salary is valid
	 * @param {*} salary Salary
	 * @returns {*|*|boolean} Salary is valid
	 */
	validateSalary(salary) {
		return utils.isIntegerNonNegativeNumber(salary);
	},
	/**
	 * Check if a string is representing a full name (surname-name)
	 * @param {string} fullName A string
	 * @returns {boolean} The name is valid
	 */
	validateFullName(fullName) {
		const parts = fullName.split('-');
		return typeof fullName === 'string' && parts.length === 2 && parts[0].length !== 0 && parts[1].length !== 0;
	},
	/**
	 * Make an unified name representation
	 * @param {string} str A string
	 * @returns {string} The modified name
	 */
	toInnerNameRepresentation(str) {
		return str[0].toUpperCase() + str.slice(1).toLowerCase();
	},
	/**
	 * Check if a parameter is a valid page
	 * @param {int} page A page
	 * @returns {*|boolean} A page is valid
	 */
	validatePage(page) {
		return utils.isStringPositiveNumber(page);
	},
	/**
	 * Check if a parameter is a valid filter
	 * @param {*} filter A filter
	 * @returns {*|boolean} A filter is valid
	 */
	validateFilter(filter) {
		return this.validateName(filter);
	}
};
