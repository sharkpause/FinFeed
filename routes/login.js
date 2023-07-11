const router = require('express').Router();

const { login, reset, clicked, success } = require('../controllers/login');
const resetAuth = require('../middleware/resetAuth');

router.route('/').post(login);
router.route('/reset').post(reset);
router.route('/reset/:token').get(clicked);
router.route('/reset/success').post(resetAuth, success);

module.exports = router;
