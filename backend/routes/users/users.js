const express = require('express');
const router = express.Router();
const auth = require('../../config/middleware/auth');
const refresh = require('../../config/middleware/refresh');
const controller = require('../../controllers/users');

router.get('/', auth.authUser, controller.all);
router.get('/:id', auth.authUser, controller.getUserById);
router.post('/create', controller.createUser);
router.post('/recovery', controller.recoveryPassword);
router.delete('/logout', auth.authUser, controller.logoutUser);
router.post('/login', controller.loginUser);
router.delete('/', auth.authUser, controller.deleteUser);
router.put('/', auth.authUser, controller.updateUser);
router.get('/confirm/:token', controller.confirmUser);

router.put('/token', refresh.refreshToken, controller.userRefreshToken);

module.exports = router;
