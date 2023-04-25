const Account = require('../models/accounts');
const login = require('./login');

const { StatusCodes }  = require('http-status-codes');

async function signup(req, res) {
	const { username, password } = req.body;

	const displayName = req.body.displayName || req.body.username;
	const bio = req.body.bio || '';

	const user = await Account.create({
		username, password, displayName, bio
	});

	await user.save();

	res.status(StatusCodes.OK).json({ success: true, message: 'user created succesfully' });
}

module.exports = signup;
