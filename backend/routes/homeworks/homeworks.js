const express = require('express');
const router = express.Router();
const auth = require('../../config/middleware/auth');
const controller = require('../../controllers/homeworks');

router.get('/', auth.authUser, controller.getAllHomeworks);
router.get('/:homeworkId', auth.authUser, controller.getHomeworkById);
router.post('/create', auth.authUser, controller.createHomework);
router.put('/like', auth.authUser, controller.like);
router.delete('/delete', auth.authUser, controller.deleteHomework);

module.exports = router;
