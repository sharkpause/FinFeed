const Account = require('../models/accounts');

const Conflict = require('../errors/conflict');

const crypto = require('crypto');
const { StatusCodes }  = require('http-status-codes');

async function signup(req, res) {
	const { username, email, password } = req.body;

	const displayName = req.body.displayName || req.body.username;
	const bio = req.body.bio || '';

	if(username === 'default' || username === 'undefined') throw new Conflict('Username forbidden'); // default - To prevent breaking profile pictures
																									 // undefined - To reserve for user not found (user/undefined)

	try {
		if((await Account.find({ username })).length > 0) {
			throw new Conflict('Username already exists');
		}

		const emailToken = crypto.randomBytes(32).toString('hex');

		const user = await Account.create({
			username, email, password, displayName, bio
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
