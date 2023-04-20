const Account = require('../models/accounts');
const login = require('./login');

const { StatusCodes }  = require('http-status-codes');

async function signup(req, res) {
	const { username, password } = req.body;

	const user = await Account.create({
		username, password
	});

	await user.save();

	res.status(StatusCodes.OK).json({ success: true, message: 'user created succesfully' });

	login(req, res);
}

module.exports = signup;
