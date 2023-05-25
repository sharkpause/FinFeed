const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AccountSchema = mongoose.Schema({
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

AccountSchema.pre('save',  async function(next) {
	const user = this;

	if(!user.isModified('password')) next();

	if(user.isNew) {
		user.follows.count = 0;
		user.follows.followers = [];
	}

	try {
		const salt = await bcrypt.genSalt(10);

		const hash = await bcrypt.hash(user.password, salt);

		user.password = hash;
	} catch(err) {
		return next(err);
	}
});

module.exports = mongoose.model('Account', AccountSchema, 'accounts');
