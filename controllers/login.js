const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Account = require('../models/accounts');

const BadRequest = require('../errors/badrequest');
const Unauthorized = require('../errors/unauthorized');

async function login(req, res) {
	const { username, password } = req.body;

	if(!username) {
		throw new BadRequest('Please provide username');
	}

	if(!password) {
		throw new BadRequest('Please provide password');
	}

	const account = await Account.findOne({ username });

	if(!account || (await bcrypt.compare(password, account.password)) === false) {
		res.status(StatusCodes.UNAUTHORIZED);
		throw new Unauthorized('Either username or password was wrong');
	}

	const token = jwt.sign({ id: account._id, username }, process.env.JWT_SECRET, { expiresIn: '1d' });

	res.cookie('jwtToken', token, {
		httpOnly: true,
		secure: true,
		sameSite: 'none',
		maxAge: 3600000,
		domain: '.localhost',
		path: '/'
	});

	res.cookie('username', username, { domain: '.localhost', path: '/', sameSite: 'none', secure: true });

	res.status(StatusCodes.OK).json({ success: true, message: 'token and username set in cookies' });
}

module.exports = login;
