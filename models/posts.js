const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
	authorID: {
		type: mongoose.Schema.Types.ObjectID,
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

PostSchema.pre('save', async function(next) {
	const post = this;

	if(!post.isNew) return;

	post.likes.count = 0;
	post.likes.likers = [];
});

module.exports = mongoose.model('Post', PostSchema, 'posts');
