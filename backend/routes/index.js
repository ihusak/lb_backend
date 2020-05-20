const noteRoutes = require('./note_routes');
module.exports = function(app, db) {
  noteRoutes(app, db);
  app.post('/users', (req, res) => {
    // Здесь будем создавать заметку.
    res.send('Hello')
  });
};