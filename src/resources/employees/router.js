// A router for employees resource

const express = require('express');
const service = require('./service');

const router = new express.Router();

/**
 * GET /employees[?page=...&filter=...]
 * Get multiple employees info ordered by a salary descending with pagination and filtering
 * Returns: JSON
 * Return codes: 200 - OK,
 * 				 400 - The passed page or filter query parameters are invalid
 */

router.get('/', service.getMultipleEmployees);

/**
 * GET /employees/surname-name
 * Get an employee info by it's surname and name
 * Returns: JSON
 * Return codes: 200 - OK
 * 				 404 - An employee with such surname and name is not found
 * 				 400 - An query is not a valid key representation
 */
router.get('/:fullName', service.getEmployee);

/**
 * POST /employees/surname-name
 * Create a new employee. Pass an object in a body
 * Returns: JSON
 * Return codes: 201 - Created
 *				 200 - An object was not created
 *				 400 - Passed object is invalid
 */
router.post('/', service.createEmployee);

/**
 * PUT /employees/surname-name
 * Modify an existing employee. Pass an object in a body.
 * The passed object may not include key properties but has to include all of the others
 * Returns: JSON
 * Return codes: 200 - OK
 * 				 400 - The passed query or the object in a body are not valid
 * 				 404 - An employee with such surname and name is not found
 */
router.put('/:fullName', service.updateEmployee);

/**
 * DELETE /employees/surname-name
 * Delete an employee.
 * Returns: JSON
 * Return codes: 200 - OK
 * 				 400 - The passed query is invalid
 * 				 404 - An employee with such surname and name is not found
 */
router.delete('/:fullName', service.deleteEmployee);

module.exports = router;
