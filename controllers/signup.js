const Account = require('../models/accounts');
const Token = require('../models/tokens');

const Conflict = require('../errors/conflict');

const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { StatusCodes }  = require('http-status-codes');

require('dotenv').config();

async function signup(req, res) {
	const { username, email, password } = req.body;

	const displayName = req.body.displayName || req.body.username;
	const bio = req.body.bio || '';

	if(username === 'default' || username === 'undefined') throw new Conflict('Username forbidden'); // default - To prevent breaking profile pictures
																									 // undefined - To reserve for user not found (user/undefined)

	try {
		if((await Account.find({ username })).length > 0) {
			return res.status(409).json({ errorCode: 1 });
		}
		if((await Account.find({ email })).length > 0) {
			return res.status(409).json({ errorCode: 2 });
		}

		const emailToken = crypto.randomBytes(32).toString('hex');
		await Token.create({ token: emailToken, email });

		// Send email here

		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			secure: false,
			auth: {
				user: process.env.EMAIL,
				pass: process.env.EMAIL_PASS
			}
		});

		const info = await transporter.sendMail({
			from: 'FinFeed',
			to: email,
			subject: 'Verify FinFeed email',
			text: emailToken
		});

		res.status(200).json({ emailSent: true });
	} catch(err) {
		if(err.statusCode === 409) {
			throw err;
		}
		console.log(err);
	}

}

async function success(req, res) {
	const { username, email, password } = req.body;

	const displayName = req.body.displayName || req.body.username;
	const bio = req.body.bio || '';

	const user = await Account.create({
		username, email, password, displayName, bio
	});

	res.status(StatusCodes.OK).json({ success: true, message: 'user created succesfully' });
}

module.exports = signup;
