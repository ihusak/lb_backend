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
const { refreshToken } = require('../config/middleware/refresh');

exports.all = (cb) => {
  db.get().collection('users').find({}).toArray((err, docs) => {
    cb(err, docs);
  })
};

exports.createUser = async (user, registerToken, invited, cb) => {
  db.get().collection('users').findOne({'email': user.email}, (err, matchUser) => {
    if(!matchUser) {
      if(user.role.id === RolesEnum.ADMIN) {
        user.role.status = true;
      }
      const invitationData = registerToken ? jwt.verify(registerToken, config.emailSercet) : null;
      console.log('invitationData', invitationData);
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
          let student
          if(invitationData && invitationData.inviter.roleId === RolesEnum.PARENT) {
            student = new UserInfoStudent({
              userName: user.userName,
              email: user.email,
              role: user.role,
              id: userId,
              parent: {
                name: invitationData.inviter.name,
                email: invitationData.inviter.email,
                phone: ''
              }
            });
          } else {
            student = new UserInfoStudent({
              userName: user.userName,
              email: user.email,
              role: user.role,
              id: userId,
              parent: {
                name: '',
                email: invited,
                phone: ''
              }
            });
          }
          console.log('STUDENT', student);
          createUserInfoByRole('userStudentInfo', student);
          break;
          case RolesEnum.PARENT:
          let parent;
          if(invitationData && invitationData.inviter.roleId === RolesEnum.STUDENT) {
            parent = new UserInfoParent({
              userName: user.userName,
              email: user.email,
              role: user.role,
              id: userId,
              myKid: [{
                id: invitationData.inviter.id,
                name: invitationData.inviter.name,
                email: invited
              }]
            });
          } else {
            parent = new UserInfoParent({
              userName: user.userName,
              email: user.email,
              role: user.role,
              id: userId,
              myKid: [{
                id: null,
                name: null,
                email: invited
              }]
            });
          }
          console.log('PARENT', parent);
          createUserInfoByRole('userParentInfo', parent);
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
  let accessToken;
  let refreshToken;
  db.get().collection('users').findOne({'email': user.email}, (err, matchUser) => {
    if(matchUser) {
      accessToken = generateAccessToken({id: matchUser._id, roleId: matchUser.role.id});
      refreshToken = jwt.sign({id: matchUser._id, roleId: matchUser.role.id}, config.refreshToken, {expiresIn: '3d'});
      db.get().collection('tokens').insertOne({refreshToken, accessToken, userId: matchUser._id});
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
  let accessToken, refreshToken;
  accessToken = generateAccessToken({id: user.id, roleId: user.roleId});
  refreshToken = jwt.sign({id: user.id, roleId: user.roleId}, config.refreshToken, {expiresIn: '20d'});
  db.get().collection('tokens').find({}).toArray((err, tokens) => {
    const mathToken = tokens.find( t => t.userId === user.id);
    if(mathToken) {
      db.get().collection('tokens').updateOne({userId: new ObjectID(user.id)}, {$set: {'accessToken': accessToken, 'refreshToken': refreshToken}})
    }
    cb(err, accessToken, refreshToken);
  });
};

exports.recoverPassword = (recoveryData, cb) => {
  db.get().collection('users').findOneAndUpdate({email: recoveryData.email}, {$set: {userPassword: recoveryData.newPassword}}, (err, doc) => {
    cb(err, doc.value);
  })
};

generateAccessToken = (user) => {
  return jwt.sign(user, config.accessToken, {expiresIn: '1d'})
}

createUserInfoByRole = (collection, user) => {
  db.get().collection(collection).findOne({'email': user.email}, (err, userInfoMatch) => {
    if(!userInfoMatch) {
      db.get().collection(collection).insertOne(user, (err, doc) => {})
    }
  })
}
