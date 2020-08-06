const express = require('express');
const router = express.Router();
const auth = require('../../config/middleware/auth');
const controller = require('../../controllers/task');

router.get('/all', auth.authUser, controller.getAllTasks);
router.get('/:id', auth.authUser, controller.getTaskById);
router.post('/status/coach/:coachId/group/:groupId', auth.authUser, controller.getStatusTasks);
router.post('/create-task', auth.authUser, controller.createTask);
router.put('/update-task/:id', auth.authUser, controller.updateTask);
router.delete('/delete-task/:id', auth.authUser, controller.deleteTaskById);

module.exports = router;