const express = require('express');
const router = express.Router();
const controller = require('../../controllers/roles');

router.get('/', controller.getRoles);

module.exports = router;