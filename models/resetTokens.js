const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ResetTokenSchema = new mongoose.Schema({
	token: {
		type: String,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		maxlength: 500,
		validate: {
			validator: email => {
				return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/gm;
			},
			message: 'Invalid email'
		}
	}
});

module.exports = mongoose.model('ResetToken', ResetTokenSchema, 'resetTokens');
