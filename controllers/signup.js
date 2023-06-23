const Account = require('../models/accounts');

const Conflict = require('../errors/conflict');

const { StatusCodes }  = require('http-status-codes');

async function signup(req, res) {
	const { username, password } = req.body;

	const displayName = req.body.displayName || req.body.username;
	const bio = req.body.bio || '';

	try {
		if((await Account.find({ username })).length > 0) {
			throw new Conflict('Username already exists');
		}
		const user = await Account.create({
			username, password, displayName, bio
		});
	} catch(err) {
		if(err.statusCode === 409) {
			throw err;
		}
		console.log(err);
	}

	res.status(StatusCodes.OK).json({ success: true, message: 'user created succesfully' });
}

module.exports = signup;
