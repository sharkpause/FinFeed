const router = require('express').Router({ mergeParams: true });

const validateParams = require('../middleware/params');
const auth = require('../middleware/auth');

const { getAccount, deleteAccount } = require('../controllers/accounts');

router.use(validateParams);

router.route('/')
	.get(getAccount);

router.route('/')
	.delete(auth, deleteAccount);

module.exports = router;
