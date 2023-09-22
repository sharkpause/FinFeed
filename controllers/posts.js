const Post = require('../models/posts');
const Account = require('../models/accounts');
const Count = require('../models/counts');

const NotFound = require('../errors/notfound');
const BadRequest = require('../errors/badrequest');
const Unauthorized = require('../errors/unauthorized');

const { StatusCodes } = require('http-status-codes');
const easyimg = require('easyimage');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath.path);

const fs = require('fs').promises;
const path = require('path');

async function getHomePosts(req, res) {
	const from = req.query.from || 0;

	let posts = (await Post.find({}).skip(from).limit(10).sort('-createdAt'));

	res.status(StatusCodes.OK).json({ posts });
}

async function getAllPosts(req, res) {
	const posts = await Post.find({ author: req.params.username });

	res.status(StatusCodes.OK).json({ posts, numPosts: posts.length });
}

async function getPost(req, res) {
	res.status(StatusCodes.OK).json({ post: req.queryData.post });
}

async function createPost(req, res) {
	const { content } = req.body;
	const { username } = req.params;
	const postMedia =  req.file;

	if(!content) {
		throw new BadRequest('Please provide the post content');
	}

	const user = req.queryData.user;

	if(req.token.username !== username || req.token.id !== String(user._id)) {
		throw new Unauthorized('You are not authorized to make posts on behalf of ' + username);
	}

	const documentProperty = {
		author: username,
		authorDisplay: user.displayName,
		content
	};

	if(postMedia) {
		const count = (await Count.findOne({ username })).count;
		if(postMedia.mimetype.includes('image')) {
			const tmp_path = `public/postMedias/${username}/${username}${count-1}.jpg`;
			const tmp_extless = tmp_path.replace('.jpg', '.jpeg');

			await easyimg.convert({ src: tmp_path, dst: tmp_extless, quality: 80 });
			await fs.unlink(tmp_path);

			documentProperty.medNum = count - 1;
		} else {
			const tmp_path = `public/postMedias/${username}/${username}${count-1}.vid`;
			const tmp_extless = tmp_path.replace('.vid', '.mp4');

			ffmpeg(tmp_path)
				.fps(30)
				.addOptions(['-crf 28'])
				.output(tmp_extless)
				.on('end', async () => {
					await fs.unlink(tmp_path);
				})
				.on('error', err => {
					throw err;
				})
				.run();
			
			documentProperty.medNum = count - 1;
		}
	}

	const newPost = await Post.create(documentProperty);

	res.status(StatusCodes.CREATED);
	res.redirect('/');
}

async function likePost(req, res) {
	const { liker } = req.body;

	if(!liker) {
		throw new BadRequest('Please provide liker username');
	}

	const post = req.queryData.post;

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

		res.status(StatusCodes.OK);
		res.end();
	}
}

async function dislikePost(req, res) {
	const { disliker } = req.body;

	if(!disliker) {
		throw new BadRequest('Please provide disliker username');
	}

	const post = req.queryData.post;

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

		res.status(StatusCodes.OK);
		res.end();
	}
}

async function deletePost(req, res) {
	const { username, postID } = req.params;

	const userID = req.queryData.user._id;

	if(req.token.username !== username || req.token.id !== String(userID)) {
		throw new Unauthorized('You are not authorized to delete posts on behalf of ' + username);
	}

	const post = req.queryData.post;
	if(post.medNum >= 0) {
		try {
			await fs.unlink(`public/postMedias/${username}/${username}${post.medNum}.jpeg`);
		} catch(err) {
			try {
				await fs.unlink(`public/postMedias/${username}/${username}${post.medNum}.mp4`);
			} catch(err) {
				throw err;
			}
		}
	}

	const result = await Post.deleteOne({ _id: postID });

	if(result.deletedCount <= 0) {
		throw new NotFound('Post not does not exist');
	}

	res.status(StatusCodes.OK);
	res.end();
}

async function deletePostMedia(req, res) {
	const { username } = req.params;

	const userID = req.queryData.user._id;

	if(req.token.username !== username || req.token.id !== String(userID)) {
		throw new Unauthorized('You are not authorized to delete post pictures behalf of ' + username);
	}

	const post = req.queryData.post;
	if(post.medNum >= 0) {
		try {
			await fs.unlink(`public/postMedias/${username}/${username}${post.medNum}.jpeg`);
		} catch(err) {
			await fs.unlink(`public/postMedias/${username}/${username}${post.medNum}.mp4`);
		}
	}

	post.set('medNum', undefined);
	await post.save();

	res.status(StatusCodes.OK);
	res.end();
}

async function editPost(req, res) {
	const { username } = req.params;
	const { content } = req.body;
	const postMedia = req.file;

	if(!content) {
		throw new BadRequest('Please provide the new edited content');
	}

	const userID = req.queryData.user._id;

	if(req.token.username !== username || req.token.id !== String(userID)) {
		throw new Unauthorized('You are not authorized to edit posts on behalf of ' + username);
	}

	const post = req.queryData.post;
	post.edited = true;
	post.content = content;

	if(postMedia) {
		if(postMedia.mimetype.includes('image')) {
			const count = (await Count.findOne({ username })).count;

			const tmp_path = postMedia.path;
			
			const medNum = post.medNum || count;
			await easyimg.convert({ src: tmp_path, dst: `public/postMedias/${username}/${username}${medNum}.jpeg`, quality: 80 });
			await fs.unlink(tmp_path);
			try {
				await fs.unlink(`public/postMedias/${username}/${username}${medNum}.mp4`);
			} catch(err) {
				;
			}

			if(!post.medNum) {
				post.medNum = count;
			}
		} else {
			const count = (await Count.findOne({ username })).count;

			const tmp_path = postMedia.path;

			const medNum = post.medNum || count;
			ffmpeg(tmp_path)
				.fps(30)
				.addOptions(['-crf 28'])
				.output(`public/postMedias/${username}/${username}${medNum}.mp4`)
				.on('end', async () => {
					await fs.unlink(tmp_path);
				})
				.on('error', err => {
					throw err;
				})
				.run();
			
			try {
				await fs.unlink(`public/postMedias/${username}/${username}${medNum}.jpeg`);
			} catch(err) {
				;
			}

			if(!post.medNum) {
				post.medNum = count;
			}
		}
	}

	await post.save();

	res.status(StatusCodes.OK);
	res.redirect('/');
}

module.exports = { getAllPosts, getPost, createPost, likePost, dislikePost, deletePost, deletePostMedia, editPost, getHomePosts };
