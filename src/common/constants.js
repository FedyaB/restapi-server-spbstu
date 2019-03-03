// Various constants used in the project

module.exports = {
	// Resources routes
	routes: {
		index: '/',
		employees: '/employees'
	},
	// Available HTTP response codes
	httpCodes: {
		notFound: 404,
		ok: 200,
		badRequest: 400,
		created: 201,
		internalError: 500
	},
	// Database tables' names
	tables: {
		employees: 'employees'
	},
	// Available employees' positions
	positions: [
		'Junior Software Engineer',
		'Software Engineer',
		'Senior Software Engineer',
		'Lead Software Engineer'
	],
	pageEntries: 25 // Entries on page (pagination)
};
