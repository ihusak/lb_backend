const Users = require('../models/users');
const ObjectID = require('mongodb').ObjectID;

exports.all = (req, res) => {
  Users.all((err, docs) => {
    if(err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(docs);
  })
};

exports.createUser = (req, res) => {
  const user = {name: req.body.name, surname: req.body.surname};
  Users.createUser(user, (err, docs) => {
    if(err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(user);
  })
};

exports.getUserById = (req, res) => {
  let userId = {'_id': new ObjectID(req.params.id)};
  Users.getUserById(userId, (err, doc) => {
    if(err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(doc);
  })
};

exports.deleteUser = (req, res) => {
  let userId = {'_id': new ObjectID(req.params.id)};
  Users.deleteUser(userId, (err, doc) => {
    if(err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send('Note ' + req.params.id + ' deleted!');
  })
};

exports.updateUser = (req, res) => {
  let userId = {'_id': new ObjectID(req.params.id)};
  const user = {name: req.body.name, surname: req.body.surname};
  Users.updateUser(user, userId, (err, doc) => {
    if(err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send('Note ' + req.params.id + ' UPDATED!');
  })
};