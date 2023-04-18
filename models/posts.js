const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
	author: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now
	},
	content: {
		type: String,
		required: true
	},
	likes: {
		type: Number,
		required: true
	}
});

module.exports = mongoose.model('Post', PostSchema, 'posts');
