// A model representation for users resource

const validator = require('./validator');

module.exports = {
	/**
	 * Resource representation constructor (user)
	 * @param {object} entry An object to be constructed from
	 * @constructor
	 */
	User(entry) {
		this.password = entry.password;
		this.id = entry.id;
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
	 * Validate credentials part of an entry
	 * @param {object} entry An entry
	 * @returns {boolean} Credentials part is valid
	 */
	validateCredentialsPart(entry) {
		return validator.validateCredentialsSchema(entry);
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
	}
};
