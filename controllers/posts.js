const Post = require('../models/posts');
const Account = require('../models/accounts');

const NotFound = require('../errors/notfound');
const BadRequest = require('../errors/badrequest');
const Unauthorized = require('../errors/unauthorized');

const { StatusCodes } = require('http-status-codes');

async function getHomePosts(req, res) {
	let posts = (await Post.find({})).reverse();

	res.status(StatusCodes.OK).json({ posts, numPosts: posts.length });
}

async function getAllPosts(req, res) {
	const posts = await Post.find({ author: req.params.username });

	res.status(StatusCodes.OK).json({ posts, numPosts: posts.length });
}

async function getPost(req, res) {
	const { postID } = req.params;

	const post = await Post.findOne({ _id: postID });

	res.status(StatusCodes.OK).json({ post });
}

async function createPost(req, res) {
	const { content } = req.body;
	const { username } = req.params;

	if(!content) {
		throw new BadRequest('Please provide the post content');
	}

	const user = await Account.findOne({ username });

	if(req.token.username !== username || req.token.id !== String(user._id)) {
		throw new Unauthorized('You are not authorized to make posts on behalf of ' + username);
	}

	const newPost = await Post.create({
		author: username,
		authorDisplay: user.displayName,
		content
	});

	res.status(StatusCodes.CREATED).json({ success: true, message: 'Succesfully created post' });
}

async function likePost(req, res) {
	const { postID } = req.params;
	const { liker } = req.body;

	if(!liker) {
		throw new BadRequest('Please provide liker username');
	}

	const post = await Post.findOne({ _id: postID });

	const likerID = (await Account.findOne({ username: liker }))._id;

	if(req.token.username !== liker || req.token.id !== String(likerID)) {
		throw new Unauthorized('You are not authorized to like posts on behalf of ' + liker);
	}

	if(post.likes.likers.includes(liker)) {
		--post.likes.count;
		post.likes.likers.splice(post.likes.likers.indexOf(liker), 1);

		await post.save();

		res.status(StatusCodes.OK).json({ success: true, message: 'Succesfully unliked post' });
	} else {
		++post.likes.count;
		post.likes.likers.push(liker);

		if(post.dislikes.dislikers.includes(liker)) {
			--post.dislikes.count;
			post.dislikes.dislikers.splice(post.dislikes.dislikers.indexOf(liker), 1);
		}

		await post.save();

		res.status(StatusCodes.OK).json({ success: true, message: 'Succesfully liked post' });
	}
}

async function dislikePost(req, res) {
	const { postID } = req.params;
	const { disliker } = req.body;

	if(!disliker) {
		throw new BadRequest('Please provide disliker username');
	}

	const post = await Post.findOne({ _id: postID });

	const dislikerID = (await Account.findOne({ username: disliker }))._id;

	if(req.token.username !== disliker || req.token.id !== String(dislikerID)) {
		throw new Unauthorized('You are not authorized to like posts on behalf of ' + disliker);
	}

	if(post.dislikes.dislikers.includes(disliker)) {
		--post.dislikes.count;
		post.dislikes.dislikers.splice(post.dislikes.dislikers.indexOf(disliker), 1);

		await post.save();

		res.status(StatusCodes.OK).json({ success: true, message: 'Succesfully undisliked post' });
	} else {
		++post.dislikes.count;
		post.dislikes.dislikers.push(disliker);

		if(post.likes.likers.includes(disliker)) {
			--post.likes.count;
			post.likes.likers.splice(post.likes.likers.indexOf(disliker), 1);
		}

		await post.save();

		res.status(StatusCodes.OK).json({ success: true, message: 'Succesfully disliked post' });
	}
}

async function deletePost(req, res) {
	const { username, postID } = req.params;

	const userID = (await Account.findOne({ username }))._id;

	if(req.token.username !== username || req.token.id !== String(userID)) {
		throw new Unauthorized('You are not authorized to delete posts on behalf of ' + username);
	}

	const result = await Post.deleteOne({ _id: postID });

	if(result.deletedCount <= 0) {
		throw new NotFound('Post not does not exist');
	}

	res.status(StatusCodes.OK).json({ success: true, message: 'Successfully deleted post' });
}

async function editPost(req, res) {
	const { username, postID } = req.params;
	const { content } = req.body;

	if(!content) {
		throw new BadRequest('Please provide the new edited content');
	}

	const userID = (await Account.findOne({ username }))._id;

	if(req.token.username !== username || req.token.id !== String(userID)) {
		throw new Unauthorized('You are not authorized to edit posts on behalf of ' + username);
	}

	await Post.updateOne({ _id: postID }, { edited: true, content });

	res.status(StatusCodes.OK).json({ success: true, message: 'Successfully edited post' });
}

module.exports = { getAllPosts, getPost, createPost, likePost, dislikePost, deletePost, editPost, getHomePosts };
