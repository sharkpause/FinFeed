const router = require('express').Router({ mergeParams: true });
const subdomain = require('express-subdomain');

const accountProfile = require('../controllers/accountProfile');

router.get('/', accountProfile);
router.use(subdomain('api', accountProfile));

module.exports = router;
