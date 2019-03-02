module.exports = {
	routes: {
		index: '/',
		employees: '/employees'
	},
	httpCodes: {
		notFound: 404,
		ok: 200,
		badRequest: 400,
		created: 201,
		internalError: 500
	},
	tables: {
		employees: 'employees'
	},
	ranks: [
		'Junior Software Engineer',
		'Software Engineer',
		'Senior Software Engineer',
		'Lead Software Engineer'
	],
	pageEntries: 25
};
