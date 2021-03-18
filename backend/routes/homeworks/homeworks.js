const express = require('express');
const router = express.Router();
const auth = require('../../config/middleware/auth');
const controller = require('../../controllers/homeworks');

router.get('/create', auth.authUser, controller.createHomework);

module.exports = router;