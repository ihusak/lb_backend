const express = require('express');
const router = express.Router();
const auth = require('../../config/middleware/auth');
const controller = require('../../controllers/users');

router.get('/', auth.authUser, controller.all);
router.get('/:id', controller.getUserById);
router.post('/', controller.createUser);
router.post('/login', controller.loginUser);
router.delete('/:id', controller.deleteUser);
router.put('/:id', controller.updateUser);

router.post('/token', controller.tokens);

module.exports = router;