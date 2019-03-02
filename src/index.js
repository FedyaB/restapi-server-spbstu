const http = require('http');
const express = require('express');
const createError = require('http-errors');

const dev = require('../config/dev');
const defaultProperties = require('../config/default');
const constants = require('./common/constants');
const utils = require('./common/utils');
const employeesRouter = require('./resources/employees/router');

utils.fillParameters(dev, defaultProperties, false);

const indexRouter = new express.Router();
indexRouter.get('/', (req, res, _) => res.json({}));

const index = express();
index.use(express.json());
index.use(express.urlencoded({extended: false}));
index.use(constants.routes.index, indexRouter);
index.use(constants.routes.employees, employeesRouter);

index.use((req, res, next) => next(createError(constants.httpCodes.notFound)));

index.use((err, req, res, _) => res.status(err.status).json(utils.createErrorBody(err)));

index.set('port', dev.port);
const server = http.createServer(index);
server.listen(dev.port);
