const auth = require('../config/middleware/auth');

module.exports = function(app, controller) {
  app.get('/users', auth.authUser, controller.all);
  app.get('/users/:id', controller.getUserById);
  app.post('/users', controller.createUser);
  app.post('/users/login', controller.loginUser);
  app.delete('/users/:id', controller.deleteUser);
  app.put('/users/:id', controller.updateUser);

  app.post('/users/token', controller.tokens);
  app.get('/roles', controller.getRoles);
};