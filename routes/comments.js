const router = require('express').Router({ mergeParams: true });

const { getAllComments, getComment, createComment, likeComment, dislikeComment, deleteComment, editComment } = require('../controllers/comments.js');

const auth = require('../middleware/auth');
const validateParams = require('../middleware/params');

router.use('/', validateParams);
router.route('/')
	.get(getAllComments)
	.post(auth, createComment);

router.use('/:commentID', validateParams);
router.route('/:commentID')
	.get(getComment)
	.delete(auth, deleteComment)
	.patch(auth, editComment);

router.use('/:commentID/like', validateParams);
router.route('/:commentID/like')
	.patch(auth, likeComment);

router.use('/:commentID/dislike', validateParams);
router.route('/:commentID/dislike')
	.patch(auth, dislikeComment);

module.exports = router;
