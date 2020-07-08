const express = require('express');
const router = express.Router();
const auth = require('../../config/middleware/auth');
const controller = require('../../controllers/users');

router.get('/', auth.authUser, controller.all);
router.get('/:id', auth.authUser, controller.getUserById);
router.post('/', controller.createUser);
router.delete('/logout', auth.authUser, controller.logoutUser);
router.post('/login', controller.loginUser);
router.delete('/:id', auth.authUser, controller.deleteUser);
router.put('/:id', auth.authUser, controller.updateUser);

router.post('/token', controller.userToken);

module.exports = router;