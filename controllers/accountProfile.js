const Account = require('../models/accounts');

const path = require('path');

async function getProfile(req, res) {
	res.sendFile(path.resolve(__dirname, '..', 'public', 'profile', 'index.html'));
}

module.exports = getProfile;
