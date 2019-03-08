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
	 * Validate a key part of an entry
	 * @param {object} entry An entry
	 * @returns {boolean} A key part is valid
	 */
	validateKeyPart(entry) {
		return validator.validateKeySchema(entry);
	},
	/**
	 * Validate data part of an entry
	 * @param {object} entry An entry
	 * @returns {boolean} Data part is valid
	 */
	validateDataPart(entry) {
		return validator.validateDataSchema(entry);
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
		if (!validator.validateKeyString(query)) {
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
