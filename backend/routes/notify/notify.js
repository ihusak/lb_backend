const express = require('express');
const router = express.Router();
const controller = require('../../controllers/notify');
const auth = require('../../config/middleware/auth');

router.get('/default/:type', auth.authUser, controller.getNotificationByDefault);
router.get('/:type', auth.authUser, controller.getNotificationLongPoll);
router.post('/', auth.authUser, controller.sendNotify);

module.exports = router;
