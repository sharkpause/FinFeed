const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized');

async function authMiddleware(req, res, next) {
	const token = req.cookies.jwtToken;

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.token = {
			id: decoded.id,
			username: decoded.username
		}

		next();
	} catch(err) {
		throw new Unauthorized(err);
	}
}

module.exports = authMiddleware;
