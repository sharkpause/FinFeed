const router = require('express').Router();
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

router.use('/', swaggerUI.serve);
router.use('/', swaggerUI.setup(swaggerDocument));

module.exports = router;
