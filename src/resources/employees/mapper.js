// A mapper for employees resource

const halson = require('halson');

const constants = require('../../common/constants');

module.exports = {
	/**
	 * Wrap an object with HAL (employees)
	 * @param {object} object An object to be wrapped
	 * @param {int} currentPage A current page
	 * @param {string} currentFilter A current filter
	 * @returns {*} A wrapped object
	 */
	wrapEmployees(object, currentPage, currentFilter) {
		return halson(object)
			.addLink('self', constants.routes.employees)
			.addLink('next', constants.routes.employees + '?page=' + (currentPage + 1) + (currentFilter ? currentFilter : ''))
			.addLink('filter', {
				href: constants.routes.employees + '{?filter}',
				template: true
			})
			.addLink('post', {
				href: constants.routes.employees
			})
			.addLink('employees', {
				name: 'employee',
				href: constants.routes.employees + '/{id}',
				template: true
			})
			.addLink('employee:put', {
				href: constants.routes.employees + '/{id}',
				template: true
			})
			.addLink('employee:delete', {
				href: constants.routes.employees + '/{id}',
				template: true
			});
	},
	/**
	 * Wrap an object with HAL (an employee page)
	 * @param {object} object An object to be wrapped
	 * @param {int} key The key of a current employee
	 * @returns {*} A wrapped object
	 */
	wrapSingleEmployee(object, key) {
		return halson(object)
			.addLink('self', constants.routes.employees + '/' + key.id)
			.addLink('put', constants.routes.employees + '/' + key.id)
			.addLink('delete', constants.routes.employees + '/' + key.id);
	},
	/**
	 * Wrap an object with HAL (when the object is empty)
	 * @param {int} key The key of a current employee
	 * @returns {*} A wrapped object
	 */
	wrapSingleEmployeeResponse(key) {
		return this.wrapSingleEmployee({}, key);
	},
	/**
	 * Wrap an object with HAL (after an employee's deletion)
	 * @param {int} key The key of a deleted employee
	 * @returns {*} A wrapped object
	 */
	wrapEmployeeDeletion(key) {
		return halson()
			.addLink('self', constants.routes.employees + '/' + key.id);
	}
};

