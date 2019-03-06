// A model representation for employees resource
const validator = require('./validator');

module.exports = {
	/**
	 * Resource representation constructor (employee)
	 * @param {object} entry An object to be constructed from
	 * @constructor
	 */
	Employee(entry) {
		this.id = entry.id;
		this.name = entry.name;
		this.surname = entry.surname;
		this.position = entry.position;
		this.birthday = entry.birthday;
		this.salary = entry.salary;
	},
	/**
	 * Check if a object is an Employee (duck typing)
	 * @param {object} entry An object to be checked
	 * @param {boolean} keyNecessary A key part of a model is necessary
	 * @returns {boolean} An object has an employee's properties
	 */
	isEmployee(entry, keyNecessary) {
		return 'name' in entry &&
		'surname' in entry &&
		'birthday' in entry &&
		'salary' in entry &&
		'position' in entry &&
		(!keyNecessary || 'id' in entry);
	},
	/**
	 * Validate an object to be an employee (with restrictions for properties values)
	 * @param {object} entry An object to be checked
	 * @param {boolean} keyNecessary A key part of a model is necessary
	 * @returns {boolean} An object passes the restrictions for an Employee object
	 */
	validateEntry(entry, keyNecessary) {
		return this.isEmployee(entry, keyNecessary) &&
			validator.validateName(entry.name) &&
			validator.validateName(entry.surname) &&
			validator.validateBirthday(entry.birthday) &&
			validator.validateSalary(entry.salary) &&
			validator.validatePosition(entry.position) &&
			(!keyNecessary || validator.validateID(entry.id));
	},
	/**
	 * Create a key from an object
	 * @param {object} entry An arbitrary object
	 * @returns {object} Key object
	 */
	keyFromEntry(entry) {
		return {
			id: entry.id
		};
	},
	/**
	 * Create a key from a query
	 * @param {string} query A query from which a key is created
	 * @returns {*} A key object (or undefined if failed)
	 */
	keyFromQuery(query) {
		if (!validator.validateIDString(query)) {
			return undefined;
		}

		return {
			id: parseInt(query, 10)
		};
	},
	/**
	 * Modify an object names fields as to be normalized.
	 * A.e. modify a name: tEd -> Ted
	 * @param {object} entry A object to be normalized
	 * @returns {*} A modified object
	 */
	normalizeNames(entry) {
		entry.name = validator.toInnerNameRepresentation(entry.name);
		entry.surname = validator.toInnerNameRepresentation(entry.surname);
		return entry;
	}
};
