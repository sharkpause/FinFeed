const mongoose = require('mongoose');;

const CommentSchema = mongoose.Schema({
	post: {
		type: mongoose.Schema.Types.ObjectID,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	content: {
		type: String,
		required: true
	},
	like: {
		type: Number,
		default: 0
	}
});

module.exports = mongoose.model('Comment', CommentSchema, 'comments');
