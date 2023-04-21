const Comment = require('../models/comments');
const Account = require('../models/accounts');
const Post = require('../models/posts');

const { StatusCodes } = require('http-status-codes');

const Unauthorized = require('../errors/unauthorized');
const BadRequest = require('../errors/badrequest');
const NotFound = require('../errors/notfound');

async function getAllComments(req, res) {
	const { username, postID } = req.params;

	const user = await Account.findOne({ username });

	if(!user) {
		throw new NotFound('User does not exist');
	}

	const post = await Post.findOne({ _id: postID });

	if(!post) {
		throw new NotFound('Post does not exist');
	}

	const comments = await Comment.find({ postID });

	res.status(StatusCodes.OK).send(comments);
}

async function getComment(req, res) {
	const { username, postID, commentID } = req.params;

	const user = await Account.findOne({ username });

	if(!user) {
		throw new NotFound('User does not exist');
	}

	const post = await Post.findOne({ _id: postID });

	if(!post) {
		throw new NotFound('Post does not exist');
	}

	const comment = await Comment.findOne({ _id: commentID });

	res.status(StatusCodes.OK).send(comment);

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

	const user = await Account.findOne({ username });

	if(!user) {
		throw new NotFound('User does not exist');
	}

	const post = await Post.findOne({ _id: postID });

	if(!post) {
		throw new NotFound('Post does not exist');
	}

	if(req.token.username !== commentator) {
		throw new Unauthorized('You are not authorized to create comments on the behalf of ' + commentator);
	}

	const newComment = await Comment.create({
		postID: postID,
		authorID: await Account.findOne({ username: commentator }),
		content
	});

	res.status(StatusCodes.CREATED).json({ success: true, message: 'Succesfully created comment' });
}

async function likeComment(req, res) {
	const { username, postID, commentID } = req.params;
	const { likerID } = req.body;

	if(!likerID) {
		throw new BadRequest('Please provide liker ID');
	}

	const user = await Account.findOne({ username });

	if(!user) {
		throw new NotFound('User does not exist');
	}

	const post = await Post.findOne({ _id: postID });

	if(!post) {
		throw new NotFound('Post does not exist');
	}

	const comment = await Comment.findOne({ _id: commentID });

	if(!comment) {
		throw new NotFound('Comment does not exist');
	}

	if(req.token.id !== likerID) {
		throw new Unauthorized('You are not authorized to like posts on behalf of ' + username);
	}

	if(comment.likes.likers.includes(likerID)) {
		--comment.likes.count;
		comment.likes.likers.splice(comment.likes.likers.indexOf(likerID), 1);

		await comment.save();

		res.status(StatusCodes.OK).json({ success: true, message: 'Succesfully unliked comment' });
	} else {
		++comment.likes.count;
		comment.likes.likers.push(likerID);

		if(comment.dislikes.dislikers.includes(likerID)) {
			--comment.dislikes.count;
			comment.dislikes.dislikers.splice(comment.dislikes.dislikers.indexOf(likerID), 1);
		}

		await comment.save();

		res.status(StatusCodes.OK).json({ success: true, message: 'Succesfully liked comment' });
	}
}

async function dislikeComment(req, res) {
	const { username, postID, commentID } = req.params;
	const { dislikerID } = req.body;

	if(!dislikerID) {
		throw new BadRequest('Please provide disliker ID');
	}

	const user = await Account.findOne({ username });

	if(!user) {
		throw new NotFound('User does not exist');
	}

	const post = await Post.findOne({ _id: postID });

	if(!post) {
		throw new NotFound('Post does not exist');
	}

	const comment = await Comment.findOne({ _id: commentID });

	if(!comment) {
		throw new NotFound('Comment does not exist');
	}

	if(req.token.id !== dislikerID) {
		throw new Unauthorized('You are not authorized to like posts on behalf of ' + username);
	}

	if(comment.dislikes.dislikers.includes(dislikerID)) {
		--comment.dislikes.count;
		comment.dislikes.dislikers.splice(comment.dislikes.dislikers.indexOf(dislikerID), 1);

		await comment.save();

		res.status(StatusCodes.OK).json({ success: true, message: 'Succesfully undisliked comment' });
	} else {
		++comment.dislikes.count;
		comment.dislikes.dislikers.push(dislikerID);

		if(comment.likes.likers.includes(dislikerID)) {
			--comment.likes.count;
			comment.likes.likers.splice(comment.likes.likers.indexOf(dislikerID), 1);
		}

		await comment.save();

		res.status(StatusCodes.OK).json({ success: true, message: 'Succesfully disliked comment' });
	}
}

async function deleteComment(req, res) {
	const { username, postID, commentID } = req.params;

	const user = await Account.findOne({ username });

	if(!user) {
		throw new NotFound('User does not exist');
	}

	if(req.token.username !== username || req.token.id !== String(user._id)) {
		throw new Unauthorized('You are not authorized to delete comments on behalf of ' + username);
	}

	const post = await Post.findOne({ _id: postID });

	if(!post) {
		throw new NotFound('Post not does not exist');
	}

	const result = await Comment.deleteOne({ _id: commentID });

	if(result.deletedCount <= 0) {
		throw new NotFound('Comment not does not exist');
	}


	res.status(StatusCodes.OK).json({ success: true, message: 'Successfully deleted comment' });
}

module.exports = { getAllComments, getComment, createComment, likeComment, dislikeComment, deleteComment };
