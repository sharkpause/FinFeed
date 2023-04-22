const router = require('express').Router();

const { getAllComments, getComment, createComment, likeComment, dislikeComment, deleteComment, editComment } = require('../controllers/comments.js');

const auth = require('../middleware/auth');

router.route('/:username/posts/:postID/comments')
	.get(getAllComments)
	.post(auth, createComment);

router.route('/:username/posts/:postID/comments/:commentID')
	.get(getComment)
	.delete(auth, deleteComment)
	.patch(auth, editComment);

router.route('/:username/posts/:postID/comments/:commentID/like')
	.patch(auth, likeComment);

router.route('/:username/posts/:postID/comments/:commentID/dislike')
	.patch(auth, dislikeComment);

module.exports = router;
