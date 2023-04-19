const router = require('express').Router();

const { getAllPosts, getPost, createPost, likePost } = require('../controllers/posts');

router.route('/')
	.post(createPost);

router.route('/:userID')
	.get(getAllPosts);

router.route('/:userID/:postID')
	.get(getPost)
	.patch(likePost);

module.exports = router;
