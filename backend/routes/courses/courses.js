const express = require('express');
const router = express.Router();
const controller = require('../../controllers/courses');
const auth = require('../../config/middleware/auth');

router.get('/', controller.getCourses);
router.get('/coach/:coachId', controller.getCourseByCoachId);
router.post('/create-course', auth.authUser, controller.createCourse);

module.exports = router;
