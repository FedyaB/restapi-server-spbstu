// A router for employees resource

const express = require('express');
const authenticator = require('../users/authenticator');
const service = require('./service');

const router = new express.Router();
const auth = authenticator.getAuthConfigurations();

/**
 * GET /employees[?page=...&filter=...]
 * Get multiple employees info ordered by a salary descending with pagination and filtering
 * Returns: JSON
 * Return codes: 200 - OK,
 * 				 400 - The passed page or filter query parameters are invalid
 */

router.get('/', auth.optional, service.getMultipleEmployees);

/**
 * GET /employees/id
 * Get an employee info by it's id
 * Returns: JSON
 * Return codes: 200 - OK
 * 				 404 - An employee with such an id was not found
 * 				 400 - An query is not a valid key representation
 */
router.get('/:id', auth.optional, service.getEmployee);

/**
 * POST /employees
 * Create a new employee. Pass an object in a body
 * Returns: JSON
 * Return codes: 201 - Created
 *				 200 - An object was not created
 *				 400 - Passed object is invalid
 */
router.post('/', auth.optional, service.createEmployee);

/**
 * PUT /employees/id
 * Modify an existing employee. Pass an object in a body.
 * The passed object may not include key properties but has to include all of the others
 * An employee needs to be logged in to perform an operation
 * Returns: JSON
 * Return codes: 200 - OK
 * 				 400 - The passed query or the object in a body are not valid
 * 				 404 - An employee with such an id
 * 				 403 - Access denied (a user either not logged in or tries to modify a different user)
 */
router.put('/:id', auth.required, service.updateEmployee);

/**
 * DELETE /employees/id
 * Delete an employee.
 * An employee needs to be logged in to perform an operation
 * Returns: JSON
 * Return codes: 200 - OK
 * 				 400 - The passed query is invalid
 * 				 404 - An employee with such an id
 * 				 403 - Access denied (a user either not logged in or tries to delete a different user)
 */
router.delete('/:id', auth.required, service.deleteEmployee);

module.exports = router;
