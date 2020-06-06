const Users = require('../models/users');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const User = require('../models/schemas/userSchema');
const errorHandler = require('../config/error-handler');

const salt = bcrypt.genSaltSync(10);

exports.all = (req, res) => {
  Users.all((err, docs) => {
    if(err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(docs);
  })
};

exports.createUser = (req, res, next) => {
  let password = bcrypt.hashSync(req.body.userPassword, salt);
  const user = new User({
    userName: req.body.userName, 
    email: req.body.email, 
    userPassword: password, 
    userType: req.body.userType,
    role: req.body.userRole
  });
  Users.createUser(user, (err, docs) => {
    if(err) {
      return res.sendStatus(500);
    } 
    if(!docs) {
      const err = {name: 'User already exist', title: 'User', code: 410};
      return next(err);
    };
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

exports.loginUser = (req, res) => {
  const user = {email: req.body.email, userPassword: bcrypt.hashSync(req.body.userPassword, salt)};
  let userInfo = {};
  Users.loginUser(user, (err, docs, tokens) => {
    let matchUser = docs.filter(userInDb => {
      return bcrypt.compareSync(req.body.userPassword, userInDb.userPassword) && userInDb.email === user.email
    });
    if(err) {
      return res.sendStatus(500);
    };
    userInfo = matchUser[0];
    console.log('!!!mathUser', matchUser);
    if(userInfo) {
      userInfo.tokens = tokens;
      res.send({userInfo});
    } else {
      res.sendStatus(404);
    }
  })
};

exports.tokens = (req, res) => {
  const refreshToken = req.body.token;
  Users.tokens((err, tokens, jwt, config, generateToken) => {
    if(err) return res.sendStatus(500);
    if(refreshToken == null) return res.sendStatus(401);
    if(!tokens.some(t => t.refreshToken == refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, config.refreshToken, (err, user) => {
      if(err) return res.sendStatus(403);
      const accesToken = generateToken({name: user.name});
      return res.json({accesToken});
    })
  })
}

exports.getRoles = (req, res) => {
  Users.getRoles((err, roles) => {
    if(err) return res.sendStatus(500);
    return res.json(roles);
  })
}