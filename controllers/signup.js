const Account = require('../models/accounts');

const Conflict = require('../errors/conflict');

const { StatusCodes }  = require('http-status-codes');

async function signup(req, res) {
	const { username, password } = req.body;

	const displayName = req.body.displayName || req.body.username;
	const bio = req.body.bio || '';

	try {
		const user = await Account.create({
			username, password, displayName, bio
		});
	} catch(err) {
		if(err.code === 11000) {
			res.status(StatusCodes.CONFLICT)
			throw new Conflict('Username already exists');
		}
	}

	res.status(StatusCodes.OK).json({ success: true, message: 'user created succesfully' });
}

module.exports = signup;
