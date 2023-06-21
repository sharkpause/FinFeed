const router = require('express').Router();
const subdomain = require('express-subdomain');

const signup = require('../controllers/signup');

router.route('/').post(signup);

router.use(subdomain('api', signup));

module.exports = router;
