const router = require('express').Router({ mergeParams: true });

const auth = require('../middleware/auth');
const validateParams = require('../middleware/params');

const { getAllPosts, getPost, createPost, likePost, dislikePost, deletePost, editPost } = require('../controllers/posts');

router.use('/', validateParams);

router.route('/')
	.post(auth, createPost);

router.route('/')
	.get(getAllPosts);

router.route('/:postID')
	.get(getPost)
	.delete(auth, deletePost)
	.patch(auth, editPost);

router.route('/:postID/like')
	.patch(auth, likePost);

router.route('/:postID/dislike')
	.patch(auth, dislikePost);

module.exports = router;
