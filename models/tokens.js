const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
	token: String,
	email: String
});

module.exports = mongoose.model('Token', TokenSchema, 'tokens');
