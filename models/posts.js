const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
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
		required: true,
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

PostSchema.pre('save', async function(next) {
	const post = this;

	if(!post.isNew) return;

	post.likes.count = 0;
	post.likes.likers = [];

	post.dislikes.count = 0;
	post.dislikes.dislikers = [];
});

module.exports = mongoose.model('Post', PostSchema, 'posts');
