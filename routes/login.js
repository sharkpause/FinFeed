const router = require('express').Router();

const login = require('../controllers/login');

router.route('/').post(login);

module.exports = router;
