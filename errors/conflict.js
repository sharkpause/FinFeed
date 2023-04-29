const { StatusCodes } = require('http-status-codes');

class Conflict extends Error {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.CONFLICT;
	}
}

module.exports = Conflict;
