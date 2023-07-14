const mongoose = require('mongoose');

const CountSchema = new mongoose.Schema({
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
	count: {
		type: Number,
		default: 0
	}
});

module.exports = mongoose.model('Count', CountSchema, 'counts');
