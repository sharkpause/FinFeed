const router = require('express').Router({ mergeParams: true });
const multer = require('multer');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/profilePictures/');
	},
	filename: (req, file, cb) => {
		cb(null, req.params.username + '.jpg');
	}
});

const upload = multer({ storage });

const validateParams = require('../middleware/params');
const auth = require('../middleware/auth');

const { getAccount, deleteAccount, editAccount, followAccount, logOut } = require('../controllers/accounts');

router.use('/', validateParams);
router.route('/')
	.get(getAccount)
	.delete(auth, deleteAccount)

router.use('/edit', validateParams);
router.route('/edit')
	.post(auth, upload.single('profilePicture'), editAccount);

router.use('/follow', validateParams);
router.route('/follow')
	.patch(auth, followAccount);

router.use('/logout', validateParams);
router.route('/logout')
	.delete(logOut);

module.exports = router;
