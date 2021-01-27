const express = require('express');
const router = express.Router();
const controller = require('../../controllers/groups');
const auth = require('../../config/middleware/auth');

router.get('/', controller.getGroups);
router.post('/create-group', auth.authUser, controller.createGroup);

module.exports = router;