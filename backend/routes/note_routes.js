module.exports = function(app, db) {
  const ObjectID = require('mongodb').ObjectID;
  app.post('/users', (req, res) => {
    const user = {name: req.body.name, surname: req.body.surname};
    db.collection('users').insertOne(user, (err, result) => {
      if (err) { 
        res.send({ 'error': 'An error has occurred' }); 
      } else {
        res.send(result.ops[0]);
      }
    })
  });

  app.get('/users', (req, res) => {
    db.collection('users').find({}).toArray((err, result) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(result);
      }
    })
  })

  app.get('/users/:id', (req, res) => {
    let userId = {'_id': new ObjectID(req.params.id)};
    db.collection('users').findOne(userId, (err, result) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(result);
      }
    })
  })

  app.delete('/users/:id', (req, res) => {
    let userId = {'_id': new ObjectID(req.params.id)};
    db.collection('users').remove(userId, (err, result) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Note ' + req.params.id + ' deleted!');
      } 
    })
  })

  app.put('/users/:id', (req, res) => {
    let userId = {'_id': new ObjectID(req.params.id)};
    const user = {name: req.body.name, surname: req.body.surname};
    db.collection('users').update(userId, user, (err, result) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Note ' + req.params.id + ' UPDATED!');
      } 
    })
  })
};