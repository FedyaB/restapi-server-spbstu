// A router for users resource

const express = require('express');
const service = require('./service');
const authenticator = require('./authenticator');

const router = new express.Router();
const auth = authenticator.getAuthConfigurations();

/**
 * POST /users/login
 * Login as an employee with an id and a password
 * Pass the object consisting of an id and a password in the body
 * Returns: JSON (with a token)
 * Return codes: 200 - OK
 * 				 400 - A problem with a query representation or the body
 * 				 403 - Invalid credentials pair
 *
 */
router.post('/login', auth.optional, service.login);

module.exports = router;
