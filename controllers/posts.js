const Post = require('../models/posts');
const Account = require('../models/accounts');

const NotFound = require('../errors/notfound');
const BadRequest = require('../errors/badrequest');

async function getAllPosts(req, res) {
	const { userID } = req.params;

	const user = await Account.findOne({ _id: userID });

	if(!user) {
		throw new NotFound('User does not exist');
	}

	const posts = await Post.find({ authorID: userID });

	res.status(200).send(posts);
}

async function getPost(req, res) {
	const { userID, postID } = req.params;

	const user = await Account.findOne({ _id: userID });

	if(!user) {
		throw new NotFound('User does not exist');
	}

	const post = await Post.findOne({ _id: postID });

	res.status(200).send(post);

}

async function createPost(req, res) {
	const { userID, content } = req.body;

	if(!userID) {
		throw new BadRequest('Please provide user ID');
	}

	if(!content) {
		throw new BadRequest('Please provide the post content');
	}

	const newPost = await Post.create({
		authorID: userID,
		content
	});

	res.status(200).send({ success: true, message: 'Succesfully created post' });
}

async function likePost(req, res) {
	const { userID, postID } = req.params;

	if(!userID) {
		throw new BadRequest('Please provide user ID');
	}

	const user = await Account.findOne({ _id: userID });

	if(!user) {
		throw new NotFound('User does not exist');
	}

	if(!postID) {
		throw new BadRequest('Please provide post ID');
	}

	const post = await Post.findOne({ _id: postID });

	if(!post) {
		throw new NotFound('Post does not exist');
	}

	if(post.likes.likers.includes(userID)) {
		--post.likes.count;
		post.likes.likers.splice(post.likes.likers.indexOf(userID), 1);

		await post.save();

		res.status(200).send({ success: true, message: 'Succesfully unliked post' });
	} else {
		++post.likes.count;
		post.likes.likers.push(userID);

		await post.save();

		res.status(200).send({ success: true, message: 'Succesfully liked post' });
	}
}

module.exports = { getAllPosts, getPost, createPost, likePost };
