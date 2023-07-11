const Account = require('../models/accounts');
const verifyToken = require('../models/verifyTokens');

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

		let emailToken;

		const searchedToken = await verifyToken.findOne({ email });

		if(!searchedToken) {
			emailToken = crypto.randomBytes(32).toString('base64')
				.replace(/\+/g, '-')
				.replace(/\//g, '-')
				.replace(/=+$/g, '-');
			await verifyToken.create({ token: emailToken, username, email, password });
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
			subject: 'Verify FinFeed email',
			html: `<p>Click the following link to verify your FinFeed email: </p><a href="${process.env.VERIFY_URL + emailToken}">${process.env.VERIFY_URL + emailToken}</a>`
		};
		
		await transporter.sendMail(mailOptions);

		res.status(200).json({ emailSent: true });
	} catch(err) {
		if(err.statusCode === 409) {
			throw err;
		}
		console.log(err);
	}

}

async function success(req, res) {
	const { token } = req.params;

	const userData = await verifyToken.findOne({ token });

	const user = await Account.create({
		username: userData.username,
		email: userData.email,
		password: userData.password,
		displayName: userData.username,
		bio: ''
	});

	await verifyToken.deleteOne({ token });

	res.status(StatusCodes.OK);
	res.redirect(process.env.WEBSITE_URL + '/login');
}

module.exports = { signup, success };
