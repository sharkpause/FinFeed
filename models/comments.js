const mongoose = require('mongoose');;

const CommentSchema = mongoose.Schema({
	postID: {
		type: mongoose.Schema.Types.ObjectID,
		required: true
	},
	authorID: {
		type: mongoose.Schema.Types.ObjectID,
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
