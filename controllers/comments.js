const Comment = require('../models/comments');
const Account = require('../models/accounts');
const Post = require('../models/posts');

const { StatusCodes } = require('http-status-codes');

const Unauthorized = require('../errors/unauthorized');
const BadRequest = require('../errors/badrequest');
const NotFound = require('../errors/notfound');

async function getAllComments(req, res) {
	const { postID } = req.params;

	const comments = await Comment.find({ postID });

	res.status(StatusCodes.OK).json({ comments, numPosts: comments.length });
}

async function getComment(req, res) {
	res.status(StatusCodes.OK).json({ comment: req.queryData.comment });

}

async function createComment(req, res) {
	const { postID } = req.params;
	const { commentator, content } = req.body;

	if(!commentator) {
		throw new BadRequest('Please provide commentator username');
	}

	if(!content) {
		throw new BadRequest('Please provide comment content');
	}

	const post = req.queryData.post;

	const user = await Account.findOne({ username: commentator });

	if(req.token.username !== commentator || req.token.id !== String(user._id)) {
		throw new Unauthorized('You are not authorized to create comments on the behalf of ' + commentator);
	}

	const newComment = await Comment.create({
		postID,
		author: commentator,
		authorDisplay: user.displayName,
		content
	});

	res.status(StatusCodes.CREATED).json({ success: true, message: 'Succesfully created comment' });
}

async function likeComment(req, res) {
	const { liker } = req.body;

	if(!liker) {
		throw new BadRequest('Please provide liker username');
	}

	const comment = req.queryData.comment;

	const likerID = (await Account.findOne({ username: liker }))._id;

	if(req.token.username !== liker || req.token.id !== String(likerID)) {
		throw new Unauthorized('You are not authorized to like posts on behalf of ' + username);
	}

	if(comment.likes.likers.includes(liker)) {
		--comment.likes.count;
		comment.likes.likers.splice(comment.likes.likers.indexOf(liker), 1);

		await comment.save();

		res.status(StatusCodes.OK).json({ success: true, message: 'Succesfully unliked comment' });
	} else {
		++comment.likes.count;
		comment.likes.likers.push(liker);

		if(comment.dislikes.dislikers.includes(liker)) {
			--comment.dislikes.count;
			comment.dislikes.dislikers.splice(comment.dislikes.dislikers.indexOf(liker), 1);
		}

		await comment.save();

		res.status(StatusCodes.OK).json({ success: true, message: 'Succesfully liked comment' });
	}
}

async function dislikeComment(req, res) {
	const { disliker } = req.body;

	if(!disliker) {
		throw new BadRequest('Please provide disliker username');
	}

	const comment = req.queryData.comment;

	const dislikerID = (await Account.findOne({ username: disliker }))._id;	

	if(req.token.username !== disliker || req.token.id !== String(dislikerID)) {
		throw new Unauthorized('You are not authorized to like posts on behalf of ' + username);
	}

	if(comment.dislikes.dislikers.includes(disliker)) {
		--comment.dislikes.count;
		comment.dislikes.dislikers.splice(comment.dislikes.dislikers.indexOf(disliker), 1);

		await comment.save();

		res.status(StatusCodes.OK).json({ success: true, message: 'Succesfully undisliked comment' });
	} else {
		++comment.dislikes.count; comment.dislikes.dislikers.push(disliker);

		if(comment.likes.likers.includes(disliker)) {
			--comment.likes.count;
			comment.likes.likers.splice(comment.likes.likers.indexOf(disliker), 1);
		}

		await comment.save();

		res.status(StatusCodes.OK).json({ success: true, message: 'Succesfully disliked comment' });
	}
}

async function deleteComment(req, res) {
	const { username, commentID } = req.params;

	const comment = req.queryData.comment;
	const user = await Account.findOne({ username: comment.author });

	if(req.token.username !== user.username || req.token.id !== String(user._id)) {
		if(req.token.username === username) {
			if(req.token.id !== String((await Account.findOne({ username }))._id))
				throw new Unauthorized('You are not authorized to delete this comment');
		} else {
			throw new Unauthorized('You are not authorized to delete this comment');
		}
	}

	const result = await Comment.deleteOne({ _id: commentID });

	if(result.deletedCount <= 0) {
		throw new NotFound('Comment not does not exist');
	}


	res.status(StatusCodes.OK).json({ success: true, message: 'Successfully deleted comment' });
}

async function editComment(req, res) {
	const { username } = req.params;
	const { content } = req.body;

	if(!content) {
		throw new BadRequest('Please provide the new edited content');
	}

	const comment = req.queryData.comment;
	const user = await Account.findOne({ username: comment.author });

	if(req.token.username !== username || req.token.id !== String(user._id)) {
		throw new Unauthorized('You are not authorized to edit posts on behalf of ' + username);
	}

	comment.edited = true;
	comment.content = content;

	await comment.save();

	res.status(StatusCodes.OK).json({ success: true, message: 'Successfully edited comment' });
}

module.exports = { getAllComments, getComment, createComment, likeComment, dislikeComment, deleteComment, editComment };
