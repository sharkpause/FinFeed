const Account = require('../models/accounts');
const Post = require('../models/posts');

const { StatusCodes } = require('http-status-codes');

async function getAccount(req, res) {
	const { username } = req.params;

	const user = await Account.findOne({ username }).select({ username: 1, bio: 1, createdAt: 1, displayName: 1 });
	const posts = await Post.findOne({ authorID: user._id})

	res.status(StatusCodes.OK).json({ user, posts });
}

module.exports = { getAccount };
