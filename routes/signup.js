const router = require('express').Router();

const signup = require('../controllers/signup');

router.route('/').post(signup);

module.exports = router;
