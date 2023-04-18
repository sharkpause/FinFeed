const { StatusCodes } = require('http-status-codes');

class Unauthorized extends Error {
	constructor(message) {
		this.message = message;
		this.statusCode = StatusCodes.UNAUTHORIZED;
	}
}

module.exports = Unauthorized;
