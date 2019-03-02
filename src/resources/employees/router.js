const express = require('express');
const constants = require('../../common/constants');
const mapper = require('./mapper');

const router = new express.Router();
router.get('/', (req, res, _) => res.status(constants.httpCodes.ok).json(mapper.getAll()));

router.post('/', (req, res, _) => {
	mapper.add(req.body.name, req.body.rank, req.body.age, req.body.salary);
	res.status(constants.httpCodes.ok).json({});
});
module.exports = router;

