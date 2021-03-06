// A service module for employees resource

const _ = require('lodash');
const createError = require('http-errors');

const constants = require('../../common/constants');
const authenticator = require('../users/authenticator');
const validator = require('./validator');
const repository = require('./repository');
const model = require('./model');
const mapper = require('./mapper');

/**
 * Get normalized key from a query and check for existence of an employee
 * @param {object} req A request object
 * @returns {*} Normalized key ('key' property) or error ('error' property) object
 */
function getNormalizedKeyAndCheckExistence(req) {
	// Create a key object from a query
	const key = model.keyFromQuery(req.params.id);
	if (key === undefined) {
		return {
			error: constants.httpCodes.badRequest
		};
	}

	// If such an employee is not present then 404
	if (!repository.exists(key)) {
		return {
			error: constants.httpCodes.notFound
		};
	}

	return {
		key
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
			if (validator.validatePageParameter(req.query.page)) {
				page = validator.parsePage(req.query.page);
			} else {
				next(createError(constants.httpCodes.badRequest));
				return;
			}
		}

		// If a filter is passed then try to assign it, otherwise use a default one
		if (req.query.filter) {
			if (validator.validateFilterParameter(req.query.filter)) {
				filter = validator.toInnerNameRepresentation(req.query.filter);
			} else {
				next(createError(constants.httpCodes.badRequest));
				return;
			}
		}

		// Get a JSON with employees
		res.status(constants.httpCodes.ok).json(mapper.wrapEmployees(repository.getMultiple(page, filter), page, filter));
	},
	/**
	 * Get an employee by it's key
	 * @param {object} req Request
	 * @param {object} res Result
	 * @param {function} next Next handler
	 */
	getEmployee(req, res, next) {
		// Create a key from a query
		const key = model.keyFromQuery(req.params.id);
		if (key === undefined) {
			next(createError(constants.httpCodes.badRequest));
			return;
		}

		// Get an employee info
		const found = repository.get(key);
		if (found === undefined) {
			next(createError(constants.httpCodes.notFound));
		} else {
			res.status(constants.httpCodes.ok).json(mapper.wrapSingleEmployee(found, key));
		}
	},
	/**
	 * Create an employee
	 * @param {object} req Request
	 * @param {object} res Result
	 * @param {function} next Next handler
	 */
	createEmployee(req, res, next) {
		if (model.validateDataPart(req.body) && model.validateCredentialsPart(req.body)) {
			const normalizedBody = model.normalizeNames(req.body);
			normalizedBody.id = repository.createID();
			authenticator.setPassword(normalizedBody, req.body.password);
			delete normalizedBody.password;

			if (repository.create(normalizedBody)) {
				res.status(constants.httpCodes.created).json(mapper.wrapSingleEmployeeResponse(normalizedBody));
			} else {
				next(createError(constants.httpCodes.internalError)); // Unreachable situation
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

		// Check if a the user has permissions
		if (!authenticator.isSameUser(req, result.key)) {
			next(createError(constants.httpCodes.accessDenied));
			return;
		}

		// Append (or overwrite) the object properties with key ones
		_.assign(req.body, result.key);

		if (model.validateKeyPart(req.body) && model.validateDataPart(req.body)) {
			req.body = model.normalizeNames(req.body);
			if (repository.modify(req.body)) {
				res.status(constants.httpCodes.ok).json(mapper.wrapSingleEmployeeResponse(result.key));
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

		// Check if a the user has permissions
		if (!authenticator.isSameUser(req, result.key)) {
			next(createError(constants.httpCodes.accessDenied));
			return;
		}

		repository.delete(result.key);
		res.status(constants.httpCodes.ok).json(mapper.wrapEmployeeDeletion(result.key));
	}
};
