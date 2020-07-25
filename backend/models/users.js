const db = require('../config/db');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');
const ObjectID = require('mongodb').ObjectID;
const userInfo = require('../models/userInfo');

exports.all = (cb) => {
  db.get().collection('users').find({}).toArray((err, docs) => {
    cb(err, docs);
  })
};

exports.createUser = async (user, cb) => {
  let userExist;
  db.get().collection('users').findOne({'email': user.email}, (err, matchUser) => {
    if(!matchUser) {
      db.get().collection('users').insertOne(user, (err, docs) => {
        cb(err, docs);
      });
      db.get().collection('userInfo').findOne({'email': user.email}, (err, userInfoMatch) => {
        if(!userInfoMatch) {
          userInfo.createUserInfo(user, null);
        }
      })
    } else {
      cb(err, null);
    }
  })
};

exports.confirmUserRegistration = (token, cb) => {
  const {user} = jwt.verify(token, config.emailSercet);
  console.log(user);
  if(user) {
    db.get().collection('users').updateOne({_id: new ObjectID(user)}, { $set: { 'confirmed' : true  } }, (err, doc) => {
      cb(err, doc);
    })
  } else {
    cb(err, doc);
  }
}

exports.deleteUser = (id, cb) => {
  db.get().collection('users').remove(id, (err, doc) => {
    cb(err, doc);
  })
};

exports.getRoles = (cb) => {
  db.get().collection('roles').find({}).toArray((err, docs) => {
    cb(err, docs);
  })
};


exports.getUserById = (id, cb) => {
  db.get().collection('users').findOne(id, (err, doc) => {
    cb(err, doc);
  })
};

exports.loginUser = (user, cb) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, config.refreshToken);
  db.get().collection('users').findOne({'email': user.email}, (err, matchUser) => {
    cb(err, matchUser, {accessToken, refreshToken});
  });
  db.get().collection('tokens').insertOne({refreshToken, accessToken});
}

exports.logoutUser = (token, cb) => {
  db.get().collection('tokens').deleteOne({refreshToken: token}, (err, doc) => {
    cb(err, doc);
  });
}

exports.updateUser = (updatedUser, id, cb) => {
  db.get().collection('users').update(id, updatedUser, (err, doc) => {
    cb(err, doc);
  })
};

exports.userToken = (cb) => {
  db.get().collection('tokens').find({}).toArray((err, tokens) => {
    cb(err, tokens, jwt, config, generateAccessToken);
  })
}

generateAccessToken = (user) => {
  return jwt.sign(user, config.accessToken, {expiresIn: '8h'})
}