const xss = require('xss');

function sanitizeInput(req, res, next) {
	for(const key in req.body) {
		req.body[key] = xss(req.body[key]);
	}

	console.log(req.body);

	next();
}

module.exports = sanitizeInput;
