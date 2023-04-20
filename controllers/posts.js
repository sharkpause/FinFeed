const Post = require('../models/posts');
const Account = require('../models/accounts');

const NotFound = require('../errors/notfound');
const BadRequest = require('../errors/badrequest');
const Unauthorized = require('../errors/unauthorized');

const { StatusCodes } = require('http-status-codes');

async function getAllPosts(req, res) {
	const { username } = req.params;

	const user = await Account.findOne({ username });

	if(!user) {
		throw new NotFound('User does not exist');
	}

	const posts = await Post.find({ authorID: user._id });

	res.status(StatusCodes.OK).send(posts);
}

async function getPost(req, res) {
	const { username, postID } = req.params;

	const user = await Account.findOne({ username });

	if(!user) {
		throw new NotFound('User does not exist');
	}

	const post = await Post.findOne({ _id: postID });

	if(post === null) {
		throw new NotFound('Post does not exist');
	}

	res.status(StatusCodes.OK).send(post);
}

async function createPost(req, res) {
	const { content } = req.body;
	const { username } = req.params;

	if(!content) {
		throw new BadRequest('Please provide the post content');
	}

	const user = await Account.findOne({ username });

	if(!user) {
		throw new NotFound('User does not exist');
	}

	if(req.token.username !== username || req.token.id !== String(user._id)) {
		throw new Unauthorized('You are not authorized to make posts on behalf of ' + username);
	}

	const newPost = await Post.create({
		authorID: user._id,
		content
	});

	res.status(StatusCodes.CREATED).json({ success: true, message: 'Succesfully created post' });
}

async function likePost(req, res) {
	const { postID } = req.params;
	const { likerID } = req.body;

	if(!likerID) {
		throw new BadRequest('Please provide liker ID');
	}

	const post = await Post.findOne({ _id: postID });

	if(!post) {
		throw new NotFound('Post does not exist');
	}

	if(req.token.id !== likerID) {
		throw new Unauthorized('You are not authorized to like posts on behalf of ' + (await Account.findOne({ _id: likerID })).username);
	}

	if(post.likes.likers.includes(likerID)) {
		--post.likes.count;
		post.likes.likers.splice(post.likes.likers.indexOf(likerID), 1);

		await post.save();

		res.status(StatusCodes.OK).json({ success: true, message: 'Succesfully unliked post' });
	} else {
		++post.likes.count;
		post.likes.likers.push(likerID);

		await post.save();

		res.status(StatusCodes.OK).json({ success: true, message: 'Succesfully liked post' });
	}
}

async function deletePost(req, res) {
	const { username, postID } = req.params;

	const user = await Account.findOne({ username });

	if(!user) {
		throw NotFound('User does not exist');
	}

	if(req.token.username !== username || req.token.id !== String(user._id)) {
		throw new Unauthorized('You are not authorized to delete posts on behalf of ' + username);
	}

	const result = await Post.deleteOne({ _id: postID });

	if(result.deletedCount <= 0) {
		throw new NotFound('Post not does not exist');
	}

	res.status(StatusCodes.OK).json({ success: true, message: 'Successfully deleted post' });
}

module.exports = { getAllPosts, getPost, createPost, likePost, deletePost };
