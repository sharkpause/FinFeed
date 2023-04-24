const Account = require('../models/accounts');
const Post = require('../models/posts');
const Comment = require('../models/comments');

const NotFound = require('../errors/notfound');

async function validateParams(req, res, next) {
	const { username, postID, commentID } = req.params;

	if(username) {
		const user = await Account.findOne({ username });
		if(!user) {
			throw new NotFound('User does not exist');
		}
	}

	if(postID) {
		const post = await Post.findOne({ _id: postID });
		if(!post) {
			throw new NotFound('Post does not exist');
		}
	}

	if(commentID) {
		const comment = await Comment.findOne({ _id: commentID })
		if(!comment) {
			throw new NotFound('Comment does not exist');
		}
	}

	next();
}

module.exports = validateParams;
