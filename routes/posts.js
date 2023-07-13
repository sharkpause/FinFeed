const router = require('express').Router({ mergeParams: true });
const multer = require('multer');

const Count = require('../models/counts.js');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/postPictures/');
	},
	filename: async (req, file, cb) => {
		const count = await Count.findOne({ username: req.params.username });
		cb(null, req.params.username + count.count + '.jpg');
		++count.count;
		await count.save();
	}
});

const upload = multer({ storage });

const auth = require('../middleware/auth');
const validateParams = require('../middleware/params');

const { getAllPosts, getPost, createPost, likePost, dislikePost, deletePost, editPost } = require('../controllers/posts');

router.use('/', validateParams);

router.route('/')
	.post(auth, upload.single('postImage'), createPost);

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
