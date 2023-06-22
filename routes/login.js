const router = require('express').Router();
const subdomain = require('express-subdomain');

const login = require('../controllers/login');

router.route('/').post(login);
router.use(subdomain('api', login));

module.exports = router;
