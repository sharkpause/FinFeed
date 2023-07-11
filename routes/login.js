const router = require('express').Router();

const { login, reset, clicked, success } = require('../controllers/login');

router.route('/').post(login);
router.route('/reset').get(reset);
router.route('/reset/:token').get(clicked);
router.route('/reset/success').get(success);

module.exports = router;
