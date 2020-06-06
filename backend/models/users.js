const db = require('../config/db');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');

exports.all = (cb) => {
  db.get().collection('users').find({}).toArray((err, docs) => {
    cb(err, docs);
  })
};

exports.getRoles = (cb) => {
  db.get().collection('roles').find({}).toArray((err, docs) => {
    cb(err, docs);
  })
};

exports.createUser = async (user, cb) => {
  let userExist;
  db.get().collection('users').find({}).toArray( async (err, docs) => {
    userExist = docs.some(userInDb => userInDb.email === user.email);
    if(!userExist) {
      db.get().collection('users').insertOne(user, (err, docs) => {
        cb(err, docs);
      })
    } else {
      cb(err, null);
    }
  });
};
exports.getUserById = (id, cb) => {
  db.get().collection('users').findOne(id, (err, doc) => {
    cb(err, doc);
  })
};

exports.deleteUser = (id, cb) => {
  db.get().collection('users').remove(id, (err, doc) => {
    cb(err, doc);
  })
};

exports.updateUser = (updatedUser, id, cb) => {
  db.get().collection('users').update(id, updatedUser, (err, doc) => {
    cb(err, doc);
  })
};

exports.loginUser = (user, cb) => {
  const accesToken = generateAccesToken(user);
  const refreshToken = jwt.sign(user, config.refreshToken);
  db.get().collection('users').find({}).toArray((err, docs) => {
    db.get().collection('roles').find({}).toArray((err, roles) => {
      cb(err, docs, {accesToken, refreshToken}, roles);
    })
  });
  db.get().collection('tokens').insertOne({refreshToken, accesToken});
}

exports.tokens = (cb) => {
  db.get().collection('tokens').find({}).toArray((err, tokens) => {
    cb(err, tokens, jwt, config, generateAccesToken);
  })
}

generateAccesToken = (user) => {
  return jwt.sign(user, config.accesToken, {expiresIn: '30s'})
}