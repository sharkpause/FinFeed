const Account = require('../models/accounts');

async function signup(req, res) {
	const { username, password } = req.body;

	const user = await Account.create({
		username, password
	});

	await user.save();

	res.json({ success: true, message: 'user created succesfully' });
}

module.exports = signup;
