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
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, config.refreshToken);
  db.get().collection('users').find({}).toArray((err, docs) => {
    db.get().collection('roles').find({}).toArray((err, roles) => {
      cb(err, docs, {accessToken, refreshToken}, roles);
    })
  });
  db.get().collection('tokens').insertOne({refreshToken, accessToken});
}

exports.logoutUser = (token, cb) => {
  console.log('DELETE TOKEN', token);
  db.get().collection('tokens').deleteOne({refreshToken: token}, (err, doc) => {
    cb(err, doc);
  });
}

exports.userToken = (cb) => {
  db.get().collection('tokens').find({}).toArray((err, tokens) => {
    cb(err, tokens, jwt, config, generateAccessToken);
  })
}

generateAccessToken = (user) => {
  return jwt.sign(user, config.accessToken, {expiresIn: '8h'})
}