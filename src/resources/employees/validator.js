// A validator for employees resource

const BaseJoi = require('joi');
const DateExtension = require('joi-date-extensions');

const constants = require('../../common/constants');

const Joi = BaseJoi.extend(DateExtension);

const keySchema = Joi.object().keys({
	id: Joi.number().integer().min(1).required()
}).unknown(true);

const nameRegExp = /^[a-zA-Zа-яА-ЯёЁ]{1,100}$/;
const dataSchema = Joi.object().keys({
	name: Joi.string().regex(nameRegExp).required(),
	surname: Joi.string().regex(nameRegExp).required(),
	position: Joi.string().valid(constants.positions).required(),
	birthday: Joi.date().format('DD/MM/YYYY').required(),
	salary: Joi.number().integer().min(1).required()
}).unknown(true);

const paramsSchema = Joi.object().keys({
	page: Joi.number().integer().min(1),
	filter: Joi.string().regex(nameRegExp)
});

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
	 * Validate an entry with the data schema
	 * @param {object} entry An entry
	 * @returns {boolean} An entry is valid
	 */
	validateDataSchema(entry) {
		return Joi.validate(entry, dataSchema).error === null;
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
	},
	/**
	 * Check if a parameter is a valid page
	 * @param {int} page A page
	 * @returns {*|boolean} A page is valid
	 */
	validatePageParameter(page) {
		const parsedPage = parseInt(page, 10);
		if (isNaN(parsedPage)) {
			return false;
		}

		return Joi.validate({page: parsedPage}, paramsSchema);
	},
	/**
	 * Check if a parameter is a valid filter
	 * @param {*} filter A filter
	 * @returns {*|boolean} A filter is valid
	 */
	validateFilterParameter(filter) {
		return Joi.validate({filter}, paramsSchema);
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
	 * Parse a page from a string
	 * @param {string} s A string
	 * @returns {number} The parsed page
	 */
	parsePage(s) {
		return parseInt(s, 10);
	}
};
