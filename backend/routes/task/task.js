const express = require('express');
const router = express.Router();
const auth = require('../../config/middleware/auth');
const controller = require('../../controllers/task');

router.get('/list', auth.authUser, controller.getAllTasks);
router.get('/course/:courseId/list', auth.authUser, controller.getTasksByCourse);
router.get('/:id', auth.authUser, controller.getTaskById);
router.post('/status/coach/:coachId/course/:courseId', auth.authUser, controller.getStatusTasks);
router.post('/status/change', auth.authUser, controller.changeStatusTask);
router.post('/create', auth.authUser, controller.createTask);
router.put('/update/:id', auth.authUser, controller.updateTask);
router.delete('/delete/:id', auth.authUser, controller.deleteTaskById);

module.exports = router;
