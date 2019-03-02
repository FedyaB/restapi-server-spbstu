const utils = require('../../common/utils');
const constants = require('../../common/constants');

module.exports = {
	validateName(name) {
		return typeof name === 'string' && name.length > 0 && name.length <= 100;
	},
	validateBirthday(birthday) {
		return utils.isValidDate(birthday);
	},
	validateRank(rank) {
		for (let i = 0; i < constants.ranks.length; ++i) {
			if (rank === constants.ranks[i]) {
				return true;
			}
		}

		return false;
	},
	validateSalary(salary) {
		return utils.isIntegerNonNegativeNumber(salary);
	},
	validateFullName(fullName) {
		const parts = fullName.split('-');
		return typeof fullName === 'string' && parts.length === 2 && parts[0].length !== 0 && parts[1].length !== 0;
	},
	toName(str) {
		return str[0].toUpperCase() + str.slice(1).toLowerCase();
	},
	validatePage(page) {
		return utils.isStringPositiveNumber(page);
	},
	validateFilter(filter) {
		return this.validateName(filter);
	}
};
