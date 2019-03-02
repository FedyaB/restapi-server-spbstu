const utils = require('../../common/utils');
const constants = require('../../common/constants');
const Model = require('./model');

module.exports = {
	getAll() {
		const table = utils.getDatabase().get(constants.tables.employees);
		return table.value();
	},
	add(name, rank, age, salary) {
		const db = utils.getDatabase();
		const found = db.get(constants.tables.employees).find({name});
		const entry = new Model(name, rank, age, salary);
		if (found.value() === undefined) {
			db.get(constants.tables.employees).push(entry).write();
		} else {
			found.assign(entry).write();
		}
	}
};
