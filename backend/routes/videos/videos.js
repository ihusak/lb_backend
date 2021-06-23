const express = require('express');
const router = express.Router();
const auth = require('../../config/middleware/auth');
const controller = require('../../controllers/videos');

router.get('/list', auth.authUser, controller.getAllVideoPosts);
router.post('/create', auth.authUser, controller.createVideoPost);

module.exports = router;
