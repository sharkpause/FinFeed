const router = require('express').Router();

const auth = require('../middleware/auth');

const { getAllPosts, getPost, createPost, likePost } = require('../controllers/posts');

router.route('/:username/posts')
	.post(auth, createPost);

router.route('/:username/posts')
	.get(getAllPosts);

router.route('/:username/posts/:postID')
	.get(getPost)
	.patch(auth, likePost);

module.exports = router;
