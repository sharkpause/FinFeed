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
	const { commentID } = req.params;

	const comment = await Comment.findOne({ _id: commentID });

	res.status(StatusCodes.OK).json({ comment });

}

async function createComment(req, res) {
	const { username, postID } = req.params;
	const { commentator, content } = req.body;

	if(!commentator) {
		throw new BadRequest('Please provide commentator username');
	}

	if(!content) {
		throw new BadRequest('Please provide comment content');
	}

	const post = await Post.findOne({ _id: postID });

	if(req.token.username !== commentator) {
		throw new Unauthorized('You are not authorized to create comments on the behalf of ' + commentator);
	}

	const user = await Account.findOne({ commentator });

	const newComment = await Comment.create({
		postID: postID,
		author: commentator,
		authorDisplay: user.displayName,
		content
	});

	res.status(StatusCodes.CREATED).json({ success: true, message: 'Succesfully created comment' });
}

async function likeComment(req, res) {
	const { commentID } = req.params;
	const { liker } = req.body;

	if(!liker) {
		throw new BadRequest('Please provide liker username');
	}

	const comment = await Comment.findOne({ _id: commentID });

	if(req.token.username !== liker) {
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
	const { commentID } = req.params;
	const { disliker } = req.body;

	if(!disliker) {
		throw new BadRequest('Please provide disliker username');
	}

	const comment = await Comment.findOne({ _id: commentID });

	if(req.token.username !== disliker) {
		throw new Unauthorized('You are not authorized to like posts on behalf of ' + username);
	}

	if(comment.dislikes.dislikers.includes(disliker)) {
		--comment.dislikes.count;
		comment.dislikes.dislikers.splice(comment.dislikes.dislikers.indexOf(disliker), 1);

		await comment.save();

		res.status(StatusCodes.OK).json({ success: true, message: 'Succesfully undisliked comment' });
	} else {
		++comment.dislikes.count;
		comment.dislikes.dislikers.push(disliker);

		if(comment.likes.likers.includes(disliker)) {
			--comment.likes.count;
			comment.likes.likers.splice(comment.likes.likers.indexOf(disliker), 1);
		}

		await comment.save();

		res.status(StatusCodes.OK).json({ success: true, message: 'Succesfully disliked comment' });
	}
}

async function deleteComment(req, res) {
	const { commentID } = req.params;

	if(req.token.username !== username || req.token.id !== String(user._id)) {
		throw new Unauthorized('You are not authorized to delete comments on behalf of ' + username);
	}

	const result = await Comment.deleteOne({ _id: commentID });

	if(result.deletedCount <= 0) {
		throw new NotFound('Comment not does not exist');
	}


	res.status(StatusCodes.OK).json({ success: true, message: 'Successfully deleted comment' });
}

async function editComment(req, res) {
	const { username, commentID } = req.params;

	if(!newContent) {
		throw new BadRequest('Please provide the new edited content');
	}

	if(req.token.username !== username || req.token.id !== String(user._id)) {
		throw new Unauthorized('You are not authorized to edit posts on behalf of ' + username);
	}

	await Comment.updateOne({ _id: commentID }, { content });

	res.status(StatusCodes.OK).json({ success: true, message: 'Successfully edited comment' });
}

module.exports = { getAllComments, getComment, createComment, likeComment, dislikeComment, deleteComment, editComment };
