const db = require('../config/db');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');
const userInfoSchema = require('./schemas/userInfoSchema');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'afreestylers2016@gmail.com',
    pass: 'afreestylers2016'
  }
});
const RolesEnum = require('../config/enum/roles');

exports.acceptUserTask = (userId, task, cb) => {
  console.log(userId, task);
  // db.get().collection('userInfo').findOneAndUpdate(userId, {$set: {

  // }}, {returnOriginal: false}, (err, doc) => {
  //   cb(err, doc.value);
  // })
}

exports.createUserInfo = (body, cb) => {
  const userInfo = new userInfoSchema({
    id: body._id,
    email: body.email,
    userName: body.userName,
    role: body.role
  });
  const table = defineUserInfoTable(body.role.id);
  db.get().collection(table).insertOne(userInfo, (err, doc) => {
    if(cb) {
      cb(err, doc)
    }
  })
};

exports.getUserInfo = (id, roleId, cb) => {
  let userId = {'id': id};
  const table = defineUserInfoTable(roleId);
  switch(parseInt(roleId)) {
    case RolesEnum.ADMIN: 
    getUserInfoByRole(userId, table, cb);
    break;
    case RolesEnum.STUDENT: 
    getUserInfoByRole(userId, table, cb);
    break;
    case RolesEnum.PARENT: 
    getUserInfoByRole(userId, table, cb);
    break;
    case RolesEnum.COACH: 
    console.log('COACH FIND');
    getUserInfoByRole(userId, table, cb);
    break;
  }
}

exports.getAllUserInfo = (roleId, cb) => {
  const table = defineUserInfoTable(roleId);
  db.get().collection(table).find({}).toArray((err, usersInfo) => {
    cb(err, usersInfo);
  })
}

exports.getUserInfoByCoach = (coachId, cb) => {
  db.get().collection('userStudentInfo').find({'coach.id': coachId}).toArray((err, usersInfo) => {
    cb(err, usersInfo);
  })
}

exports.updateUserInfo = (id, userInfo, file, roleId, cb) => {
  let userId = {'id': id};
  let userInfoBody = JSON.parse(userInfo);
  if(file) userInfoBody.userImg = file.path;
  let userInfoReq = { $set: userInfoBody };
  const table = defineUserInfoTable(roleId);
  db.get().collection(table).findOneAndUpdate(userId, userInfoReq, {returnOriginal: false}, (err, doc) => {
    cb(err, doc.value);
  })
}

exports.changeTaskStatus = (task, id, cb) => {
  let userId = {'id': id};
  db.get().collection('userStudentInfo').findOneAndUpdate(userId, {$set: { 'currentTask' : task  }}, {returnOriginal: false}, (err, doc) => {
    cb(err, doc.value);
  })
}


exports.requestCoachPermission = (id, phone, host, cb) => {
  let userId = {'id': id};
  db.get().collection('userCoachInfo').findOne(userId, (err, foundUser) => {
    sendRequestCoachPermission(foundUser, phone, host);
    cb(err, foundUser);
  })
}

exports.acceptCoachRequest = (token, cb) => {
  const {id} = jwt.verify(token, config.emailSercet);
  if(id) {
    db.get().collection('userCoachInfo').updateOne({'id': id},{ $set: { 'role.status' : true  } }, (err, foundUser) => {
      cb(err, foundUser);
    })
  }
}

sendRequestCoachPermission = (user, phone, host) => {
  const userPhone = user.phone ? user.phone : phone;
  const emailToken = jwt.sign(
    {
      id: user.id
    },
    config.emailSercet,
    {
      expiresIn: '1d'
    }
  );
  if(host.indexOf('local') >= 0) {
    host = 'http://' + host;
  } else {
    host = 'https://' + host;
  }
  const url = `${host}/userInfo/confirm/coach/${emailToken}`;
  console.log(url);
  const mailOptions = {
    from: user.email, // sender address
    to: 'ilyagusak@gmail.com', // list of receivers
    subject: 'Request Coach Permission #LB', // Subject line
    html: `<h1>${user.userName} want's to be a coach</h1>
    <p>Please contact him to confirm coach permission: <b>${userPhone}</b></p>
    <p>if everything fine click <a href='${url}'>Confirm coach request</a></p>
    `// plain text body
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if(err)
      console.log(err)
    else
      console.log(info);
 });
}

getUserInfoByRole = (userId, tableName, cb) => {
  console.log(tableName, userId);
  db.get().collection(tableName).findOne(userId, (err, doc) => {
    console.log(doc);
    cb(err, doc);
  })
}

defineUserInfoTable = (roleId) => {
  let table = '';
  switch (parseInt(roleId)) {
    case RolesEnum.ADMIN: table = 'userAdminInfo'; break;
    case RolesEnum.STUDENT: table = 'userStudentInfo'; break;
    case RolesEnum.COACH: table = 'userCoachInfo'; break;
    case RolesEnum.PARENT: table = 'userParentInfo'; break;
  }
  return table;
}
