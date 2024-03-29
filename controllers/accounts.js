const Account = require('../models/accounts');
const Post = require('../models/posts');
const Comment = require('../models/comments');
const Count = require('../models/counts');

const bcrypt = require('bcrypt');
const easyimg = require('easyimage');
const fs = require('fs');
const { StatusCodes } = require('http-status-codes');

const Unauthorized = require('../errors/unauthorized');
const NotFound = require('../errors/notfound');
const BadRequest = require('../errors/badrequest');

require('dotenv').config();

async function getAccount(req, res) {
	const { username } = req.params;

	const posts = await Post.find({ author: username });

	res.status(StatusCodes.OK).json({
		user: (({ username, email, bio, createdAt, displayName, follows }) => ({ username, email, bio, createdAt, displayName, follows}))(req.queryData.user),
		posts,
		numPosts: posts.length });
}

async function deleteAccount(req, res) {
	const { username } = req.params;

	const user = req.queryData.user;

	if(req.token.username !== user.username || req.token.id !== String(user._id)) {
		throw new Unauthorized('You are not authorized to delete this account');
	}

	await Post.deleteMany({ author: username });
	
	const likedPosts = await Post.find({ 'likes.likers': { $elemMatch: { $eq: user.username } } } );

	for(let i = 0; i < likedPosts.length; ++i) {
		--likedPosts[i].likes.count;
		likedPosts[i].likes.likers.splice(likedPosts[i].likes.likers.indexOf(username), 1);
		likedPosts[i].save();
	}

	const dislikedPosts = await Post.find({ 'dislikes.dislikers': { $elemMatch: { $eq: user.username } } });
	
	for(let i = 0; i < dislikedPosts.length; ++i) {
		--dislikedPosts[i].dislikes.count;
		dislikedPosts[i].dislikes.dislikers.splice(dislikedPosts[i].dislikes.dislikers.indexOf(username), 1);
		dislikedPosts[i].save();
	}
	
	await Comment.deleteMany({ author: username });

	const likedComments = await Comment.find({ 'likes.likers': { $elemMatch: { $eq: user.username } } } );

	for(let i = 0; i < likedComments.length; ++i) {
		--likedComments[i].likes.count;
		likedComments[i].likes.likers.splice(likedComments[i].likes.likers.indexOf(username), 1);
		likedComments[i].save();
	}

	const dislikedComments = await Comment.find({ 'dislikes.dislikers': { $elemMatch: { $eq: user.username } } });
	
	for(let i = 0; i < dislikedComments.length; ++i) {
		--dislikedComments[i].dislikes.count;
		dislikedComments[i].dislikes.dislikers.splice(dislikedComments[i].dislikes.dislikers.indexOf(username), 1);
		dislikedComments[i].save();
	}

	await Account.deleteOne({ _id: user._id });
	await Count.deleteOne({ username });

	if(fs.existsSync('public/profilePictures/' + username + '.jpeg')) {
		fs.unlink('public/profilePictures/' + username + '.jpeg', err => { console.log(err) });
	} if(fs.existsSync('public/postPictures/' + username)) {
		fs.rmdirSync('public/postPictures/' + username, { recursive: true }, err => { console.log(err) });
	}

	res.clearCookie('jwtToken');
	res.clearCookie('username');

	res.status(StatusCodes.OK).json({ success: true, message: 'Account succesfully deleted' });
}

async function editAccount(req, res) {
	const { username } = req.params;
	const file = req.file;

	const user = req.queryData.user;

	if(req.token.username !== username || req.token.id !== String(user._id)) {
		throw new Unauthorized('You are not authorized to edit this account');
	}

	if(req.body.email) {
		if(!Account.findOne({ email: req.body.email }))
			user.email = req.body.email;
	}
	if(req.body.password) {
		const salt = await bcrypt.genSalt(10);

		const hash = await bcrypt.hash(req.body.password, salt);

		user.password = hash;
	}
	if(req.body.displayName) {
		user.displayName = req.body.displayName;
	}
	if(req.body.bio) {
		user.bio = req.body.bio;
	}
	if(file) {
		const tmp_path = 'public/profilePictures/' + username + '.jpg';
		const tmp_extless = tmp_path.replace('.jpg', '.jpeg');

		await easyimg.convert({ src: tmp_path, dst: tmp_extless, quality: 80 });
		fs.unlink(tmp_path, err => { if(err) throw err });
	}

	await user.save();

	res.status(StatusCodes.OK)
	res.redirect(process.env.WEBSITE_URL + 'user/' + username);
}

async function followAccount(req, res) {
	const { username } = req.params;
	const { follower } = req.body;

	if(!follower) {
		throw new BadRequest('Please provide follower username');
	}

	const user = req.queryData.user;

	if(req.token.username !== follower) {
		throw new Unauthorized('You are not authorized to follow users on behalf of ' + follower);
	}

	if(follower === username) {
		throw new BadRequest('You cannot follow yourself');
	}

	if(!user.follows.followers.includes(follower)) {
		++user.follows.count;
		user.follows.followers.push(follower);

		await user.save();

		res.status(StatusCodes.OK).json({ success: true, message: 'Successfully followed user' });
	} else {
		--user.follows.count;
		user.follows.followers.splice(user.follows.followers.indexOf(follower), 1);

		await user.save();

		res.status(StatusCodes.OK).json({ success: true, message: 'Successfully unfollowed user' });
	}
}

function logOut(req, res) {
	res.clearCookie('jwtToken');
	res.clearCookie('username');
	res.end();
}

module.exports = { getAccount, deleteAccount, editAccount, followAccount, logOut };
