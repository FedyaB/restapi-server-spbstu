# REST API
St. Petersburg Polytechnic University, 2019.
## Setup
##### 1. Install NodeJS with Node Package Manager (npm). 
Version 11.10.1 is used during the development. You may download it from there: [NodeJS](https://nodejs.org) 
##### 2. Download the repository 
##### 3. Install dependencies
Run `npm install` in the command shell from the project directory
##### 4. (Optional) Edit config
Check the `./config/dev` options
##### 5. Run the server
Run `npm start`  from the project directory
##### 6. Access the server
By default it is [127.0.0.1:3000](127.0.0.1:3000/)  
## Routes
   * GET /employees[?page=...&filter=...]
     * Get multiple employees info ordered by a salary descending with pagination and filtering  
     * *Returns*: JSON  
     * *Return codes*: 200 - OK,  400 - The passed page or filter query parameters are invalid
   * GET /employees/surname-name
     * Get an employee info by it's surname and name
     * *Returns*: JSON
     * *Return codes*: 200 - OK; 404 - An employee with such surname and name is not found; 400 - An query is not a valid key representation
   * POST /employees/
      * Create a new employee. Pass an object in a body
      * *Returns*: JSON
      * *Return codes*: 201 - Created; 200 - An object was not created; 400 - Passed object is invalid
   * PUT /employees/surname-name
      * Modify an existing employee. Pass an object in a body.
      * The passed object may not include key properties but has to include all of the others
      * *Returns*: JSON
      * *Return codes*: 200 - OK; 400 - The passed query or the object in a body are not valid; 404 - An employee with such surname and name is not found
   * DELETE /employees/surname-name
     * Delete an employee.
     * Returns: JSON
     * Return codes: 200 - OK; 400 - The passed query is invalid; 404 - An employee with such surname and name is not found
