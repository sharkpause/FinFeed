const router = require('express').Router({ mergeParams: true });

const accountProfile = require('../controllers/accountProfile');

router.get('/', accountProfile);

module.exports = router;
