const router = require('express').Router({ mergeParams: true });

const validateParams = require('../middleware/params');
const auth = require('../middleware/auth');

const { getAccount, deleteAccount, editAccount, followAccount, logOut } = require('../controllers/accounts');

router.use(validateParams);

router.route('/')
	.get(getAccount)
	.delete(auth, deleteAccount)
	.patch(auth, editAccount);

router.route('/follow')
	.patch(auth, followAccount);

router.route('/logout')
	.delete(logOut);

module.exports = router;
