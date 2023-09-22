const router = require('express').Router({ mergeParams: true });
const multer = require('multer');

const Count = require('../models/counts.js');

const fs = require('fs');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const path = 'public/postMedias/' + req.params.username + '/';
		if(!fs.existsSync(path)) {
			fs.mkdirSync(path, { recursive: true });
		}

		cb(null, path);
	},
	filename: async (req, file, cb) => {
		let count = await Count.findOne({ username: req.params.username });

		if(!count) {
			count = await Count.create({ username: req.params.username });
		}

		if(file.mimetype.includes('image'))
			cb(null, req.params.username + count.count + '.jpg');
		else
			cb(null, req.params.username + count.count + '.vid');
		++count.count;
		await count.save();
	}
});

const upload = multer({ storage });

const auth = require('../middleware/auth');
const validateParams = require('../middleware/params');

const { getAllPosts, getPost, createPost, likePost, dislikePost, deletePost, deletePostMedia, editPost } = require('../controllers/posts');

router.use('/', validateParams);
router.route('/')
	.post(auth, upload.single('postMedia'), createPost)
	.get(getAllPosts);

router.use('/:postID', validateParams);
router.route('/:postID')
	.get(getPost)
	.delete(auth, deletePost)

router.use('/:postID/delete-media', validateParams);
router.route('/:postID/delete-media')
	.delete(auth, deletePostMedia);

router.use('/:postID/edit', validateParams);
router.route('/:postID/edit')
	.post(auth, upload.single('postMedia'), editPost);

router.use('/:postID/like', validateParams);
router.route('/:postID/like')
	.patch(auth, likePost);

router.use('/:postID/dislike', validateParams);
router.route('/:postID/dislike')
	.patch(auth, dislikePost);

module.exports = router;
