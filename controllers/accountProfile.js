const Account = require('../models/accounts');

const path = require('path');

async function getProfile(req, res, next) {
	res.sendFile(path.resolve(__dirname, '..', 'public', 'profile', 'index.html'));
}

module.exports = getProfile;
