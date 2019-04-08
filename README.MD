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
   * GET /employees/id
     * Get an employee info by it's id
     * *Returns*: JSON
     * *Return codes*: 200 - OK; 404 - An employee with such an id is not found; 400 - An query is not a valid key representation
   * POST /employees/
      * Create a new employee. Pass an object in a body. ID is created automatically.
      * *Returns*: JSON
      * *Return codes*: 201 - Created; 200 - An object was not created; 400 - Passed object is invalid
   * POST /users/login
      * Login as an user with an id and a password
      * Pass the object consisting of an id and a password in the body
      * *Returns*: JSON (with a token)
      * *Return codes*: 200 - OK; 400 - A problem with a query representation or the body; 403 - Invalid credentials pair
   * PUT /employees/id
      * Modify an existing employee. Pass an object in a body.
      * The passed object may not include an id (ignored if passed in the body) but has to include all of the others
      * An employee needs to be logged in to perform an operation
      * *Returns*: JSON
      * *Return codes*: 200 - OK; 400 - The passed query or the object in a body are not valid; 404 - An employee with such an id is not found;
      403 - Access denied (a user either not logged in or tries to modify a different user)
   * DELETE /employees/id
     * Delete an employee.
     * An employee needs to be logged in to perform an operation
     * *Returns*: JSON
     * *Return codes*: 200 - OK; 400 - The passed query is invalid; 404 - An employee with such an id is not found;
     403 - Access denied (a user either not logged in or tries to delete a different user)
## Config
A config file you may want to edit is *dev.js*. You are free to override any options from *default.js* in this file.  
Current supported options are:
* *port*: The port that the server listens
* *database*: The database name
