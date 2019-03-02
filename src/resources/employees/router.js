const createError = require('http-errors');

const express = require('express');
const constants = require('../../common/constants');
const utils = require('../../common/utils');
const mapper = require('./mapper');
const model = require('./model');
const service = require('./service');

const router = new express.Router();
router.get('/', (req, res, next) => {
	let page = 1;
	let filter = null;

	if (req.query.page) {
		if (service.validatePage(req.query.page)) {
			page = req.query.page;
		} else {
			next(createError(constants.httpCodes.badRequest));
			return;
		}
	}

	if (req.query.filter) {
		if (service.validateFilter(req.query.filter)) {
			filter = req.query.filter;
		} else {
			next(createError(constants.httpCodes.badRequest));
			return;
		}
	}

	res.status(constants.httpCodes.ok).json(mapper.getMultiple(page, filter));
});

router.get('/:fullName', (req, res, next) => {
	const key = model.keyFromQuery(req.params.fullName);
	if (key === undefined) {
		next(createError(constants.httpCodes.badRequest));
		return;
	}

	const found = mapper.get(key);
	if (found === undefined) {
		next(createError(constants.httpCodes.notFound));
	} else {
		res.status(constants.httpCodes.ok).json(found);
	}
});

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

router.put('/:fullName', (req, res, next) => {
	const key = model.keyFromQuery(req.params.fullName);
	if (key === undefined) {
		next(createError(constants.httpCodes.badRequest));
		return;
	}

	if (!mapper.exists(key)) {
		next(createError(constants.httpCodes.notFound));
		return;
	}

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

router.delete('/:fullName', (req, res, next) => {
	const key = model.keyFromQuery(req.params.fullName);
	if (key === undefined) {
		next(createError(constants.httpCodes.badRequest));
		return;
	}

	if (!mapper.exists(key)) {
		next(createError(constants.httpCodes.notFound));
		return;
	}

	mapper.delete(key);
	res.status(constants.httpCodes.ok).json({});
});

module.exports = router;

