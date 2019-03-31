// A service module for users resource

const createError = require('http-errors');

const constants = require('../../common/constants');
const model = require('./model');
const authenticator = require('./authenticator');

module.exports = {
	/**
	 * Log in as an employee
	 * @param {object} req Request
	 * @param {object} res Result
	 * @param {function} next Next handler
	 * @returns {*} An authentication result
	 */
	login(req, res, next) {
		if (model.validateKeyPart(req.body) && model.validateCredentialsPart(req.body)) {
			return authenticator.authenticate((err, passportUser, _) => {
				if (err) {
					next(createError(constants.httpCodes.accessDenied));
					return;
				}

				if (passportUser) {
					res.status(constants.httpCodes.ok).json(authenticator.toAuthJSON(model.keyFromEntry(passportUser)));
				} else {
					next(createError(constants.httpCodes.accessDenied));
				}
			}, req, res, next);
		}

		next(createError(constants.httpCodes.badRequest));
	}
};
