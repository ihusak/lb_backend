module.exports = function(app, controller) {
  app.get('/users', controller.all);
  app.get('/users/:id', controller.getUserById);
  app.post('/users', controller.createUser);
  app.delete('/users/:id', controller.deleteUser);
  app.put('/users/:id', controller.updateUser);
};