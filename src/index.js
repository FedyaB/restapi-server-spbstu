// An index file
/* Contains express middleware initialization, server initialization,
 * Setting callbacks for index page and error pages
 */

const http = require('http');
const express = require('express');
const createError = require('http-errors');

const dev = require('../config/dev');
const defaultProperties = require('../config/default');
const constants = require('./common/constants');
const utils = require('./common/utils');
const employeesRouter = require('./resources/employees/router');

// Fill not specified parameters in dev from default parameters
utils.fillParameters(dev, defaultProperties, false);

// Set index page routing
const indexRouter = new express.Router();
indexRouter.get('/', (req, res, _) => res.json({})); // TODO Unused parameters

// Initialize express server
const index = express();
index.use(express.json());
index.use(express.urlencoded({extended: false}));
index.use(constants.routes.index, indexRouter);
index.use(constants.routes.employees, employeesRouter);

// Routing for every page that still was not routed
index.use((req, res, next) => next(createError(constants.httpCodes.notFound)));

// Error handler
index.use((err, req, res, _) => res.status(err.status).json(utils.createErrorBody(err)));

// Create a server
index.set('port', dev.port);
const server = http.createServer(index);
server.listen(dev.port);
