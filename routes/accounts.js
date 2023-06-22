const router = require('express').Router({ mergeParams: true });
const subdomain = require('express-subdomain');

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

router.use(
	subdomain('api', getAccount),
	subdomain('api', deleteAccount),
	subdomain('api', editAccount),
	subdomain('api', followAccount),
	subdomain('api', logOut)
);

module.exports = router;
