const jwt = require('jsonwebtoken');

const Unauthorized = require('../errors/unauthorized');

async function authMiddleware(req, res, next) {
	const cookie = req.cookies.resetJWTToken;

	try {
		const decoded = jwt.verify(cookie, process.env.JWT_RESET_SECRET);

		const { token } = decoded;

		req.token = {
			token
		}

		next();
	} catch(err) {
		throw new Unauthorized(err);
	}
}

module.exports = authMiddleware;
