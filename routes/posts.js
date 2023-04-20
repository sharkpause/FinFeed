const router = require('express').Router();

const auth = require('../middleware/auth');

const { getAllPosts, getPost, createPost, likePost, dislikePost, deletePost, editPost } = require('../controllers/posts');

router.route('/:username/posts')
	.post(auth, createPost);

router.route('/:username/posts')
	.get(getAllPosts);

router.route('/:username/posts/:postID')
	.get(getPost)
	.delete(auth, deletePost)
	.patch(auth, editPost);

router.route('/:username/posts/:postID/like')
	.patch(auth, likePost);

router.route('/:username/posts/:postID/dislike')
	.patch(auth, dislikePost);

module.exports = router;
