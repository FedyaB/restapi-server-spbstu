const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');

const createError = require('http-errors');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const constants = require('../../common/constants');
const repository = require('./repository');
const model = require('./model');

/**
 * Bearer token getter
 * @param {object} req Request
 * @returns {string} A Bearer token from a header
 */
function getTokenFromHeaders(req) {
	const {headers: {authorization}} = req;

	if (authorization && authorization.split(' ')[0] === 'Bearer') {
		return authorization.split(' ')[1];
	}

	return null;
}

module.exports = {
	/**
	 * Credentials part representation
	 * @param {object} entry An object to be constructed from
	 * @constructor
	 */
	Credentials(entry) {
		this.salt = entry.salt;
		this.hash = entry.salt;
	},
	/**
	 * Set password to credentials object (compute a hash from a given password)
	 * @param {object} credentials Credentials object
	 * @param {string} password A password
		*/
	setPassword(credentials, password) {
		credentials.salt = crypto.randomBytes(constants.auth.saltBytes).toString('hex');
		credentials.hash = crypto.pbkdf2Sync(password, credentials.salt, constants.auth.iterations,
			constants.auth.keyBytes, constants.auth.algorithm).toString('hex');
	},
	/**
	 * Validate a given password according to the hash in credentials
	 * @param {object} credentials Credentials object
	 * @param {string} password A password
	 * @returns {boolean} A password is valid
	 */
	validatePassword(credentials, password) {
		const hash = crypto.pbkdf2Sync(password, credentials.salt, constants.auth.iterations,
			constants.auth.keyBytes, constants.auth.algorithm).toString('hex');
		return credentials.hash === hash;
	},
	/**
	 * Generate JSON web token from key part of an employee
	 * @param {object} key A key object
	 * @returns {*} A JWT token
	 */
	generateJWT(key) {
		const now = new Date();
		const expirationDate = new Date(now);
		expirationDate.setTime(now.getTime() + (constants.auth.jwtExpirationSeconds * 1000));

		return jwt.sign({
			key,
			exp: parseInt(expirationDate.getTime() / 1000, 10)
		}, 'secret');
	},
	/**
	 * Transform a key object to auth JSON representation
	 * @param {object} key A key object
	 * @returns {object} A key object extended with a token
	 */
	toAuthJSON(key) {
		key.token = this.generateJWT(key);
		return key;
	},
	/**
	 * Initialize an authentication module
	 */
	initializeAuthModule() {
		passport.use(new LocalStrategy({
			usernameField: 'id',
			passwordField: 'password'
		}, (id, password, done) => {
			const user = repository.get(model.keyFromQuery(id));
			if (!user || !this.validatePassword(user, password)) {
				return done(null, false, createError(constants.httpCodes.accessDenied));
			}

			return done(null, user);
		}));
	},
	/**
	 * Get authentication configurations (optional|required)
	 * @returns {{optional: (middleware|middleware), required: (middleware|middleware)}} Configurations set
	 */
	getAuthConfigurations() {
		return {
			required: expressJWT({
				secret: 'secret',
				userProperty: 'payload',
				getToken: getTokenFromHeaders
			}),
			optional: expressJWT({
				secret: 'secret',
				userProperty: 'payload',
				getToken: getTokenFromHeaders,
				credentialsRequired: false
			})
		};
	},
	/**
	 * Authentication procedure
	 * @param {function} routine An authentication routine
	 * @param {object} req Request
	 * @param {object} res Result
	 * @param {function} next Next handler
	 * @returns {*} A result of inner authentication
	 */
	authenticate(routine, req, res, next) {
		return passport.authenticate('local', {session: false}, routine)(req, res, next);
	},
	/**
	 * Check if the user that is represented with a key object and the one represented with a token in request is the same one
	 * @param {object} req Request
	 * @param {object} key A key object
	 * @returns {boolean} The user in a key object and the one from a token is the same one
	 */
	isSameUser(req, key) {
		return key.id === req.payload.key.id;
	}
};
