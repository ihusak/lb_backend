const express = require('express');
const router = express.Router();
const controller = require('../../controllers/notify');
const auth = require('../../config/middleware/auth');

router.get('/default', auth.authUser, controller.getNotificationByDefault);
router.get('/pending', auth.authUser, controller.getNotificationLongPoll);
router.post('/post', auth.authUser, controller.sendNotify);
router.put('/read', auth.authUser, controller.readNotify);

module.exports = router;
