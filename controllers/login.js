const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const Account = require('../models/accounts');
const ResetToken = require('../models/resetTokens');

const BadRequest = require('../errors/badrequest');
const Unauthorized = require('../errors/unauthorized');

require('dotenv').config();

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
	});

	res.cookie('username', username, { sameSite: 'none', secure: true });

	res.status(StatusCodes.OK).json({ success: true, message: 'token and username set in cookies' });
}

async function reset(req, res) {
	const { email } = req.body;

	let emailToken;

	const searchedToken = await ResetToken.findOne({ email });

	if(!searchedToken) {
		emailToken = crypto.randomBytes(32).toString('base64')
			.replace(/\+/g, '-')
			.replace(/\//g, '-')
			.replace(/=+$/g, '-');
		await ResetToken.create({ token: emailToken, email });
	} else {
		emailToken = searchedToken.token;
	}

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			   user: process.env.EMAIL_USER,
			   pass: process.env.EMAIL_PASS
		   }
	});

	const mailOptions = {
		from: 'finfeedapp@gmail.com',
		to: email,
		subject: 'Reset FinFeed password',
		html: `<p>Click the following link to reset your FinFeed's account password: </p><a href="${process.env.RESET_URL + emailToken}">${process.env.RESET_URL + emailToken}</a><h3>Notice: This link expires in 5 minutes</h3>`
	};

	await transporter.sendMail(mailOptions);

	res.status(200).json({ emailSent: true });
}

async function clicked(req, res) {
	const { token } = req.params;

	if(!ResetToken.findOne({ token })) {
		return res.status(401).json({ errorCode: 3 });
	}

	const resetJWTToken = jwt.sign({ token }, process.env.JWT_RESET_SECRET, { expiresIn: '5m' });

	res.cookie('resetJWTToken', resetJWTToken, {
		httpOnly: true,
		secure: true,
		sameSite: 'none',
		maxAge: 3000000,
	});

	res.redirect(process.env.WEBSITE_URL + '/reset');
}

async function success(req, res) {
	const tokenDocument = await ResetToken.findOne({ token: req.token.token });
	if(!tokenDocument) {
		res.status(401).json({ errorCode: 4 });
		throw new Unauthorized('Unauthorized to reset password');
	}

	const { password } = req.body;

	const user = await Account.findOne({ email: tokenDocument.email });
	
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	user.password = hash;

	await user.save();

	await ResetToken.deleteOne({ email: user.email });
	
	res.clearCookie('resetJWTToken');

	res.status(200).json({ success: true });
}

module.exports = { login, reset, clicked, success };
