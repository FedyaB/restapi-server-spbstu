// A validator for users resource

const Joi = require('joi');

const keySchema = Joi.object().keys({
	id: Joi.number().integer().min(1).required()
}).unknown(true);

const credentialsSchema = Joi.object().keys({
	password: Joi.string().min(4).max(20).required()
}).unknown(true);

module.exports = {
	/**
	 * Validate an entry with the key schema
	 * @param {object} entry An entry
	 * @returns {boolean} An entry is valid
	 */
	validateKeySchema(entry) {
		return Joi.validate(entry, keySchema).error === null;
	},
	/**
	 * Validate an entry with the credentials schema
	 * @param {object} entry An entry
	 * @returns {boolean} An entry is valid
	 */
	validateCredentialsSchema(entry) {
		return Joi.validate(entry, credentialsSchema).error === null;
	},
	/**
	 * Check if a string is representing a key
	 * @param {string} s A string
	 * @returns {boolean} The key is valid
	 */
	validateKeyString(s) {
		const id = parseInt(s, 10);
		if (isNaN(id)) {
			return false;
		}

		return this.validateKeySchema({id});
	}
};
