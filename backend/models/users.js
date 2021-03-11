const db = require('../config/db');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');
const ObjectID = require('mongodb').ObjectID;
const userInfo = require('../models/userInfo');
const UserInfoAdmin = require('../models/schemas/usersInfo/user-admin.schema');
const UserInfoStudent = require('../models/schemas/usersInfo/user-student.schema');
const UserInfoParent = require('../models/schemas/usersInfo/user-parent.schema');
const UserInfoCoach = require('../models/schemas/usersInfo/user-coach.schema');
const RolesEnum = require('../config/enum/roles');

exports.all = (cb) => {
  db.get().collection('users').find({}).toArray((err, docs) => {
    cb(err, docs);
  })
};

exports.createUser = async (user, cb) => {
  db.get().collection('users').findOne({'email': user.email}, (err, matchUser) => {
    if(!matchUser) {
      if(user.role.id === RolesEnum.ADMIN) {
        user.role.status = true;
      }
      db.get().collection('users').insertOne(user, (err, createdUser) => {
        cb(err, createdUser);
        const userId = createdUser.ops[0]._id;
        switch(user.role.id) {
          case RolesEnum.ADMIN: 
          const ADMIN = new UserInfoAdmin({
            userName: user.userName, 
            email: user.email, 
            role: user.role,
            id: userId
          });
          createUserInfoByRole('userAdminInfo', ADMIN);
          break;
          case RolesEnum.STUDENT: 
          const STUDENT = new UserInfoStudent({
            userName: user.userName, 
            email: user.email, 
            role: user.role,
            id: userId
          });
          createUserInfoByRole('userStudentInfo', STUDENT);
          break;
          case RolesEnum.PARENT: 
          const PARENT = new UserInfoParent({
            userName: user.userName, 
            email: user.email, 
            role: user.role,
            id: userId
          });
          createUserInfoByRole('userParentInfo', PARENT);
          break;
          case RolesEnum.COACH: 
          const COACH = new UserInfoCoach({
            userName: user.userName, 
            email: user.email, 
            role: user.role,
            id: userId
          });
          createUserInfoByRole('userCoachInfo', COACH);
          break;
        }
      });
    } else {
      cb(err, null);
    }
  })
};

exports.confirmUserRegistration = (token, cb) => {
  const {user} = jwt.verify(token, config.emailSercet);
  console.log('user', user);
  if(user) {
    db.get().collection('users').updateOne({_id: new ObjectID(user)}, { $set: { 'confirmed' : true  } }, (err, doc) => {
      console.log(err);
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
  let accessToken;
  let refreshToken;
  db.get().collection('users').findOne({'email': user.email}, (err, matchUser) => {
    if(matchUser) {
      accessToken = generateAccessToken({id: matchUser._id, roleId: matchUser.role.id});
      refreshToken = jwt.sign({id: matchUser._id, roleId: matchUser.role.id}, config.refreshToken, {expiresIn: '3d'});
      db.get().collection('tokens').insertOne({refreshToken, accessToken, userId: matchUser._id});
    } else {
      console.log('NOT MATCH USER');
    }
    cb(err, matchUser, {accessToken, refreshToken});
  });
}

exports.logoutUser = (token, userId, cb) => {
  db.get().collection('tokens').deleteOne({userId: ObjectID(userId)}, (err, doc) => {
    cb(err, doc);
  });
}

exports.updateUser = (updatedUser, id, cb) => {
  db.get().collection('users').update(id, updatedUser, (err, doc) => {
    cb(err, doc);
  })
};

exports.userRefreshToken = (user, cb) => {
  let accessToken;
  console.log(user, user.id);
  accessToken = generateAccessToken({id: user.id, roleId: user.roleId});
  refreshToken = jwt.sign({id: user.id, roleId: user.roleId}, config.refreshToken, {expiresIn: '3d'});
  db.get().collection('tokens').find({}).toArray((err, tokens) => {
    const mathToken = tokens.find( t => t.userId === user.id);
    if(mathToken) {
      db.get().collection('tokens').updateOne({userId: new ObjectID(user.id)}, {$set: {'accessToken': accessToken, 'refreshToken': refreshToken}})
    }
    cb(err, accessToken);
  });
}

generateAccessToken = (user) => {
  return jwt.sign(user, config.accessToken, {expiresIn: '3h'})
}

createUserInfoByRole = (collection, user) => {
  db.get().collection(collection).findOne({'email': user.email}, (err, userInfoMatch) => {
    if(!userInfoMatch) {
      db.get().collection(collection).insertOne(user, (err, doc) => {})
    }
  })
}
