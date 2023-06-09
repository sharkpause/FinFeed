const mongoose = require('mongoose');;

const CommentSchema = new mongoose.Schema({
	postID: {
		type: mongoose.Schema.Types.ObjectID,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	authorDisplay: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	content: {
		type: String,
		required: true,
		minlength: 1,
		maxlength: 1000
	},
	likes: {
		count: {
			type: Number,
			required: true,
			default: 0
		},
		likers: [{
			type: String,
			required: true
		}]
	},
	dislikes: {
		count: {
			type: Number,
			required: true,
			default: 0
		},
		dislikers: [{
			type: String,
			required: true
		}]
	},
	edited: {
		type: Boolean,
		default: false
	}
});

CommentSchema.pre('save', async function(next) {
	const comment = this;

	if(!comment.isNew) return;

	comment.likes.count = 0;
	comment.likes.likers = [];

	comment.dislikes.count = 0;
	comment.dislikes.dislikers = [];
});


module.exports = mongoose.model('Comment', CommentSchema, 'comments');
