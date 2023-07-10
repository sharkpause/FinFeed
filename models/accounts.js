const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AccountSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		maxlength: 30,
		minLength: 3,
		validate: {
			validator: name => {
				return /^[a-zA-Z0-9_]+$/.test(name);
			},
			message: 'Username may only contain letters, numbers, and underscores'
		}
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
	},
	password: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
	bio: {
		type: String,
		default: '',
		maxlength: 100
	},
	displayName: {
		type: String,
		default: '',
		maxlength: 50,
		minlength: 1
	},
	follows: {
		count: {
			type: Number,
			default: 0
		},
		followers: [{
			type: String,
			required: true
		}]
	}
});

module.exports = mongoose.model('Account', AccountSchema, 'accounts');
