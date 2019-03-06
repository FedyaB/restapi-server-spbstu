// A service module for employees resource

const _ = require('lodash');
const createError = require('http-errors');

const constants = require('../../common/constants');
const validator = require('./validator');
const repository = require('./repository');
const model = require('./model');

/**
 * Get normalized key from a query and check for existence of an employee
 * @param {object} req A request object
 * @returns {*} Normalized key ('key' property) or error ('error' property) object
 */
function getNormalizedKeyAndCheckExistence(req) {
	// Create a key object from a query
	const key = model.keyFromQuery(req.params.fullName);
	if (key === undefined) {
		return {
			error: constants.httpCodes.badRequest
		};
	}

	const normalizedKey = model.normalizeNames(key);

	// If such an employee is not present then 404
	if (!repository.exists(normalizedKey)) {
		return {
			error: constants.httpCodes.notFound
		};
	}

	return {
		key: normalizedKey
	};
}

module.exports = {
	/**
	 * Get multiple employees with filtering and pagination (pass in the query)
	 * @param {object} req Request
	 * @param {object} res Result
	 * @param {function} next Next handler
	 */
	getMultipleEmployees(req, res, next) {
		let page = 1;
		let filter = null;

		// If a page is passed then try to assign it, otherwise use a default value
		if (req.query.page) {
			if (validator.validatePage(req.query.page)) {
				page = req.query.page;
			} else {
				next(createError(constants.httpCodes.badRequest));
				return;
			}
		}

		// If a filter is passed then try to assign it, otherwise use a default one
		if (req.query.filter) {
			if (validator.validateFilter(req.query.filter)) {
				filter = validator.toInnerNameRepresentation(req.query.filter);
			} else {
				next(createError(constants.httpCodes.badRequest));
				return;
			}
		}

		// Get a JSON with employees
		res.status(constants.httpCodes.ok).json(repository.getMultiple(page, filter));
	},
	/**
	 * Get an employee by it's key
	 * @param {object} req Request
	 * @param {object} res Result
	 * @param {function} next Next handler
	 */
	getEmployee(req, res, next) {
		// Create a key from a query
		const key = model.keyFromQuery(req.params.fullName);
		if (key === undefined) {
			next(createError(constants.httpCodes.badRequest));
			return;
		}

		const normalizedKey = model.normalizeNames(key);

		// Get an employee info
		const found = repository.get(normalizedKey);
		if (found === undefined) {
			next(createError(constants.httpCodes.notFound));
		} else {
			res.status(constants.httpCodes.ok).json(found);
		}
	},
	/**
	 * Create an employee
	 * @param {object} req Request
	 * @param {object} res Result
	 * @param {function} next Next handler
	 */
	createEmployee(req, res, next) {
		if (model.validateEntry(req.body)) {
			const normalizedBody = model.normalizeNames(req.body);
			if (repository.create(normalizedBody)) {
				res.status(constants.httpCodes.created).json({});
			} else {
				res.status(constants.httpCodes.ok).json({});
			}
		} else {
			next(createError(constants.httpCodes.badRequest));
		}
	},
	/**
	 * Update an employee
	 * @param {object} req Request
	 * @param {object} res Result
	 * @param {function} next Next handler
	 */
	updateEmployee(req, res, next) {
		// Create a key object from a query
		const result = getNormalizedKeyAndCheckExistence(req);
		if (result.error) {
			next(createError(result.error));
			return;
		}

		// Append (or overwrite) the object properties with key ones
		_.assign(req.body, result.key);

		if (model.validateEntry(req.body)) {
			if (repository.modify(req.body)) {
				res.status(constants.httpCodes.ok).json({});
			} else {
				next(createError(constants.httpCodes.badRequest));
			}
		} else {
			next(createError(constants.httpCodes.badRequest));
		}
	},
	/**
	 * Delete an employee
	 * @param {object} req Request
	 * @param {object} res Result
	 * @param {function} next Next handler
	 */
	deleteEmployee(req, res, next) {
		// Create a key object from a query
		const result = getNormalizedKeyAndCheckExistence(req);
		if (result.error) {
			next(createError(result.error));
			return;
		}

		repository.delete(result.key);
		res.status(constants.httpCodes.ok).json({});
	}
};
