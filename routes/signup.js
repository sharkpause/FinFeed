const router = require('express').Router();

const { signup, success } = require('../controllers/signup');

router.route('/').post(signup);
router.route('/verify/:token').get(success);

module.exports = router;
