const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const VerifyTokenSchema = new mongoose.Schema({
	token: {
		type: String,
		unique: true
	},
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
});

VerifyTokenSchema.pre('save',  async function(next) {
	const user = this;

	if(!user.isModified('password')) next();

	try {
		const salt = await bcrypt.genSalt(10);

		const hash = await bcrypt.hash(user.password, salt);

		user.password = hash;
	} catch(err) {
		return next(err);
	}
});


module.exports = mongoose.model('VerifyToken', VerifyTokenSchema, 'verifyTokens');
