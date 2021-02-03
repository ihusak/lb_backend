const express = require('express');
const router = express.Router();
const controller = require('../../controllers/courses');
const auth = require('../../config/middleware/auth');

router.get('/', controller.getCourses);
router.post('/create-group', auth.authUser, controller.createCourse);

module.exports = router;