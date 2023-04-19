const { StatusCodes } = require('http-status-codes');

class Unauthorized extends Error {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.UNAUTHORIZED;
	}
}

module.exports = Unauthorized;
