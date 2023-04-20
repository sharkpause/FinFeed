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
	likes: {
		count: {
			type: Number,
			required: true,
			default: 0
		},
		likers: [{
			type: mongoose.Schema.Types.ObjectID,
			required: true
		}]
	}
});

CommentSchema.pre('save', async function(next) {
	const comment = this;

	if(!comment.isNew) return;

	comment.likes.count = 0;
	comment.likes.likers = [];
});


module.exports = mongoose.model('Comment', CommentSchema, 'comments');
