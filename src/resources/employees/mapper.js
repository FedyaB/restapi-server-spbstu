const utils = require('../../common/utils');
const constants = require('../../common/constants');
const model = require('./model');

module.exports = {
	getMultiple(page, filter) {
		let table = utils.getDatabase()
			.get(constants.tables.employees)
			.orderBy('salary', 'desc');

		if (filter) {
			table = table.filter(u => u.name === filter || u.surname === filter);
		}

		const value = table.value();
		const array = Array.isArray(value) ? value : [value];
		return array.slice(constants.pageEntries * (page - 1), constants.pageEntries * page);
	},
	get(key) {
		const db = utils.getDatabase();
		const normalizedKey = model.normalizeEntry(key);
		const found = db.get(constants.tables.employees).find(normalizedKey);
		return found.value();
	},
	create(entry) {
		const db = utils.getDatabase();
		const normalizedEntry = model.normalizeEntry(entry);
		const found = db.get(constants.tables.employees).find(model.keyFromEntry(normalizedEntry));
		if (found.value() === undefined) {
			db.get(constants.tables.employees).push(normalizedEntry).write();
			return true;
		}

		return false;
	},
	modify(entry) {
		const db = utils.getDatabase();
		const normalizedEntry = model.normalizeEntry(entry);
		const found = db.get(constants.tables.employees).find(model.keyFromEntry(normalizedEntry));
		if (found.value() === undefined) {
			return false;
		}

		found.assign(normalizedEntry).write();
		return true;
	},
	delete(key) {
		const db = utils.getDatabase();
		const normalizedKey = model.normalizeEntry(key);
		db.get(constants.tables.employees).remove(normalizedKey).write();
		return true;
	},
	exists(key) {
		const db = utils.getDatabase();
		const normalizedKey = model.normalizeEntry(key);
		const found = db.get(constants.tables.employees).find(normalizedKey);
		return found.value() !== undefined;
	}
};
