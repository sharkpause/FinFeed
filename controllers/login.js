const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const Account = require('../models/accounts');

const BadRequest = require('../errors/badrequest');
const Unauthorized = require('../errors/unauthorized');

async function login(req, res) {
	const { username, password } = req.body;

	// TODO: Security measure

	if(!username) {
		throw new BadRequest('Please provide username');
	}

	if(!password) {
		throw new BadRequest('Please provide password');
	}

	const account = await Account.findOne({ username });

	if(!account) {
		throw new Unauthorized('Either username or password was wrong');
	}

	const token = jwt.sign({ id: account._id, username: username }, process.env.JWT_SECRET, { expiresIn: '1h' });

	res.cookie('jwtToken', token, {
		httpOnly: true,
		secure: true,
		sameSite: 'none',
		maxAge: 3600000
	});

	res.status(StatusCodes.OK).json({ success: true, message: 'token set in cookies' });
}

module.exports = login;
