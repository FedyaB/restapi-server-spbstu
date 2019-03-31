// An index file
/* Contains express middleware initialization, server initialization,
 * Setting callbacks for index page and error pages
 */

const http = require('http');
const express = require('express');
const bearerToken = require('express-bearer-token');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');

const constants = require('./common/constants');
const utils = require('./common/utils');
const employeesRouter = require('./resources/employees/router');
const usersRouter = require('./resources/users/router');
const authenticator = require('./resources/users/authenticator');

// Fill not specified parameters in dev from default parameters
const properties = utils.getConfigParameters();

// Initialize express server
const app = express();
app.use(bearerToken());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// Initialize authenticator
app.use(passport.initialize());
app.use(passport.session());
authenticator.initializeAuthModule();
const auth = authenticator.getAuthConfigurations();

// Set index page routing
const indexRouter = new express.Router();
indexRouter.get('/', auth.optional, (req, res) => res.json({}));

app.use(constants.routes.index, indexRouter);
app.use(constants.routes.employees, employeesRouter);
app.use(constants.routes.users, usersRouter);

// Routing for every page that still was not routed
app.use((req, res, next) => next(createError(constants.httpCodes.notFound)));

// Error handler
app.use((err, req, res, _) => res.status(err.status).json(utils.createErrorBody(err)));

// Create a server
app.set('port', properties.port);
const server = http.createServer(app);
server.listen(properties.port);
