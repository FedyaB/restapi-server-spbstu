const service = require('./service');

module.exports = {
	Employee(entry) {
		this.name = entry.name;
		this.surname = entry.surname;
		this.rank = entry.rank;
		this.birthday = entry.birthday;
		this.salary = entry.salary;
	},
	isEmployee(entry) {
		return 'name' in entry &&
		'surname' in entry &&
		'birthday' in entry &&
		'salary' in entry &&
		'rank' in entry;
	},
	validateEntry(entry) {
		return this.isEmployee(entry) &&
			service.validateName(entry.name) &&
			service.validateName(entry.surname) &&
			service.validateBirthday(entry.birthday) &&
			service.validateSalary(entry.salary) &&
			service.validateRank(entry.rank);
	},
	validateKey(key) {
		return ('name' in key && service.validateName(key.name)) ||
			('surname' in key && service.validateName(key.surname));
	},
	keyFromEntry(entry) {
		return {
			name: entry.name,
			surname: entry.surname
		};
	},
	keyFromQuery(query) {
		if (!service.validateFullName(query)) {
			return undefined;
		}

		const parts = query.split('-');
		return {
			surname: parts[0],
			name: parts[1]
		};
	},
	normalizeEntry(entry) {
		entry.name = service.toName(entry.name);
		entry.surname = service.toName(entry.surname);
		return entry;
	}
};
