const router = require('express').Router();

const auth = require('../middleware/auth');
const validateParams = require('../middleware/params');

const { getAllPosts, getPost, createPost, likePost, dislikePost, deletePost, editPost } = require('../controllers/posts');

router.route('/:username/posts')
	.post(auth, validateParams, createPost);

router.route('/:username/posts')
	.get(validateParams, getAllPosts);

router.route('/:username/posts/:postID')
	.get(validateParams, getPost)
	.delete(auth, validateParams, deletePost)
	.patch(auth, validateParams, editPost);

router.route('/:username/posts/:postID/like')
	.patch(auth, validateParams, likePost);

router.route('/:username/posts/:postID/dislike')
	.patch(auth, validateParams, dislikePost);

module.exports = router;
