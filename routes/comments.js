const router = require('express').Router();

const { getAllComments, getComment, createComment, likeComment } = require('../controllers/comments.js');

const auth = require('../middleware/auth');

router.route('/:username/posts/:postID/comments')
	.get(getAllComments)
	.post(auth, createComment);

router.route('/:username/posts/:postID/comments/:commentID')
	.get(getComment);

router.route('/:username/posts/:postID/comments/:commentID/like')
	.patch(auth, likeComment);

module.exports = router;
