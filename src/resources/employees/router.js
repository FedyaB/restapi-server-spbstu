// A router for employees resource

const createError = require('http-errors');

const express = require('express');
const constants = require('../../common/constants');
const utils = require('../../common/utils');
const mapper = require('./mapper');
const model = require('./model');
const service = require('./service');

const router = new express.Router();

// TODO Refactor functions

/**
 * GET /employees[?page=...&filter=...]
 * Get multiple employees info ordered by a salary descending with pagination and filtering
 * Returns: JSON
 * Return codes: 200 - OK,
 * 				 400 - The passed page or filter query parameters are invalid
 */

router.get('/', (req, res, next) => {
	let page = 1;
	let filter = null;

	// If a page is passed then try to assign it, otherwise use a default value
	if (req.query.page) {
		if (service.validatePage(req.query.page)) {
			page = req.query.page;
		} else {
			next(createError(constants.httpCodes.badRequest));
			return;
		}
	}

	// If a filter is passed then try to assign it, otherwise use a default one
	if (req.query.filter) {
		if (service.validateFilter(req.query.filter)) {
			filter = req.query.filter;
		} else {
			next(createError(constants.httpCodes.badRequest));
			return;
		}
	}

	// Get a JSON with employees
	res.status(constants.httpCodes.ok).json(mapper.getMultiple(page, filter));
});

/**
 * GET /employees/surname-name
 * Get an employee info by it's surname and name
 * Returns: JSON
 * Return codes: 200 - OK
 * 				 404 - An employee with such surname and name is not found
 * 				 400 - An query is not a valid key representation
 */
router.get('/:fullName', (req, res, next) => {
	// Create a key from a query
	const key = model.keyFromQuery(req.params.fullName);
	if (key === undefined) {
		next(createError(constants.httpCodes.badRequest));
		return;
	}

	// Get an employee info
	const found = mapper.get(key);
	if (found === undefined) {
		next(createError(constants.httpCodes.notFound));
	} else {
		res.status(constants.httpCodes.ok).json(found);
	}
});

/**
 * POST /employees/surname-name
 * Create a new employee. Pass an object in a body
 * Returns: JSON
 * Return codes: 201 - Created
 *				 200 - An object was not created
 *				 400 - Passed object is invalid
 */
router.post('/', (req, res, next) => {
	if (model.validateEntry(req.body)) {
		if (mapper.create(req.body)) {
			res.status(constants.httpCodes.created).json({});
		} else {
			res.status(constants.httpCodes.ok).json({});
		}
	} else {
		next(createError(constants.httpCodes.badRequest));
	}
});

/**
 * PUT /employees/surname-name
 * Modify an existing employee. Pass an object in a body.
 * The passed object may not include key properties but has to include all of the others
 * Returns: JSON
 * Return codes: 200 - OK
 * 				 400 - The passed query or the object in a body are not valid
 * 				 404 - An employee with such surname and name is not found
 */
router.put('/:fullName', (req, res, next) => {
	// Create a key object from a query
	const key = model.keyFromQuery(req.params.fullName);
	if (key === undefined) {
		next(createError(constants.httpCodes.badRequest));
		return;
	}

	// If such an employee is not present then 404
	if (!mapper.exists(key)) {
		next(createError(constants.httpCodes.notFound));
		return;
	}

	// Append (or overwrite) the object properties with key ones
	utils.fillParameters(req.body, key, true);

	if (model.validateEntry(req.body)) {
		if (mapper.modify(req.body)) {
			res.status(constants.httpCodes.ok).json({});
		} else {
			next(createError(constants.httpCodes.badRequest));
		}
	} else {
		next(createError(constants.httpCodes.badRequest));
	}
});

/**
 * DELETE /employees/surname-name
 * Delete an employee.
 * Returns: JSON
 * Return codes: 200 - OK
 * 				 400 - The passed query is invalid
 * 				 404 - An employee with such surname and name is not found
 */
router.delete('/:fullName', (req, res, next) => {
	// Create a key object from a query
	const key = model.keyFromQuery(req.params.fullName);
	if (key === undefined) {
		next(createError(constants.httpCodes.badRequest));
		return;
	}

	// If such an employee is not present then 404
	if (!mapper.exists(key)) {
		next(createError(constants.httpCodes.notFound));
		return;
	}

	mapper.delete(key);
	res.status(constants.httpCodes.ok).json({});
});

module.exports = router;
