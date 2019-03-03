// A model representation for employees resource
const service = require('./service');

module.exports = {
	/**
	 * Resource representation constructor (employee)
	 * @param {object} entry An object to be constructed from
	 * @constructor
	 */
	Employee(entry) {
		this.name = entry.name;
		this.surname = entry.surname;
		this.position = entry.position;
		this.birthday = entry.birthday;
		this.salary = entry.salary;
	},
	/**
	 * Check if a object is an Employee (duck typing)
	 * @param {object} entry An object to be checked
	 * @returns {boolean} An object has an employee's properties
	 */
	isEmployee(entry) {
		return 'name' in entry &&
		'surname' in entry &&
		'birthday' in entry &&
		'salary' in entry &&
		'position' in entry;
	},
	/**
	 * Validate an object to be an employee (with restrictions for properties values)
	 * @param {object} entry An object to be checked
	 * @returns {*|boolean} An object passes the restrictions for an Employee object
	 */
	validateEntry(entry) {
		return this.isEmployee(entry) &&
			service.validateName(entry.name) &&
			service.validateName(entry.surname) &&
			service.validateBirthday(entry.birthday) &&
			service.validateSalary(entry.salary) &&
			service.validatePosition(entry.position);
	},
	/**
	 * Create a key from an object
	 * @param {object} entry An arbitrary object
	 * @returns {{surname: (*|string), name: *}} Key object
	 */
	keyFromEntry(entry) {
		return {
			name: entry.name,
			surname: entry.surname
		};
	},
	/**
	 * Create a key from a query
	 * @param {string} query A query from which a key is created
	 * @returns {*} A key object (or undefined if failed)
	 */
	keyFromQuery(query) {
		if (!service.validateFullName(query)) {
			return undefined;
		}

		const parts = query.split('-');
		return {
			surname: parts[0],
			name: parts[1]
		};
	},
	/**
	 * Modify an object fields as to be normalized.
	 * A.e. modify a name: tEd -> Ted
	 * @param {object} entry A object to be normalized
	 * @returns {*} A modified object
	 */
	normalizeEntry(entry) {
		entry.name = service.toInnerNameRepresentation(entry.name);
		entry.surname = service.toInnerNameRepresentation(entry.surname);
		return entry;
	}
};
