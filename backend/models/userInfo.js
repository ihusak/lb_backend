const db = require('../config/db');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');
const studentInfoSchema = require('./schemas/usersInfo/user-student.schema');
const adminInfoSchema = require('./schemas/usersInfo/user-admin.schema');
const parentInfoSchema = require('./schemas/usersInfo/user-parent.schema');
const coachInfoSchema = require('./schemas/usersInfo/user-coach.schema');
const { createTransporter } = require('../config/email');
const RolesEnum = require('../config/enum/roles');
const { ObjectID } = require('mongodb');
const { userTasksLogger } = require('../config/middleware/logger');

exports.acceptTask = (userId, task, cb) => {
  db.get().collection('userStudentInfo').findOneAndUpdate({'id': userId}, {$set: {
    'currentTask.status': 'Done'
  }, $push: {'doneTasks': task.taskId}}, {returnOriginal: false}, (err, studentInfo) => {
    const studentInfoValue = studentInfo.value;
    db.get().collection("tasks").find({'course.id': task.courseId}).toArray((err, foundTasks) => {
      if(studentInfoValue.currentTask.course.id !== studentInfoValue.course.id) {
        if(studentInfoValue.rating >= 100) {
          studentInfoValue.rating = 0;
        }
      }
      studentInfoValue.doneTasks = studentInfoValue.doneTasks.filter((id) => {
        return foundTasks.find(task => task._id.toString() === id);
      });
      const progress = (studentInfoValue.doneTasks.length / foundTasks.length) * 100;
      const rating = studentInfoValue.rating + task.reward;
      db.get().collection('userStudentInfo').findOneAndUpdate({'id': userId}, {$set: {
        'progress': progress,
        'rating': rating,
        'currentTask.status': 'Done'
      }}, {returnOriginal: false}, (err, updatedStudentInfo) => {
        userLoggerTasks(`User done task`, studentInfoValue.currentTask, userId);
        cb(err, updatedStudentInfo.value);
      })
    });
  })
}

exports.createUserInfo = (body, cb) => {
  const userInfoSchema = defineUserInfoSchema(body.role.id);
  const table = defineUserInfoTable(body.role.id);
  db.get().collection(table).insertOne(userInfoSchema, (err, doc) => {
    if(cb) {
      cb(err, doc)
    }
  })
};

exports.getUserInfo = (id, roleId, cb) => {
  let userId = {'id': id};
  const table = defineUserInfoTable(roleId);
  db.get().collection(table).findOne(userId, (err, doc) => {
    cb(err, doc);
  })
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

exports.getUsersInfoByCourse = (courseId, cb) => {
  db.get().collection('userStudentInfo').find({'course.id': courseId}).toArray((err, usersInfo) => {
    const mappedStudents = usersInfo.map(stud => {
      delete stud._id;
      return stud
    });
    cb(err, mappedStudents);
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
      db.get().collection('users').updateOne({_id: new ObjectID(id)}, {$set: {'role.status': true}}, (err, user) => {});
    })
  }
}

sendRequestCoachPermission = async (user, phone, host) => {
  const transporter = await createTransporter();
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
    host = host;
  } else {
    host = 'https://lb.afreestylers.com';
  }
  const url = `${host}/userInfo/confirm/coach/${emailToken}`;
  const mailOptions = {
    from: user.email,
    to: 'ilyagusak@gmail.com',
    subject: 'Запрос на роль тренера #LB',
    html: `<h1>${user.userName} хочет быть тренером</h1>
    <p>Свяжись с ним что бы подтвердить его роль: <b>${userPhone}</b></p>
    <p>Если все этапы пройдены <a href='${url}'>Подтверди его роль</a></p>
    `
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if(err)
      console.log(err)
    else
      console.log(info);
 });
}

// getUserInfoByRole = (userId, tableName, cb) => {
//   db.get().collection(tableName).findOne(userId, (err, doc) => {
//     cb(err, doc);
//   })
// }

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

defineUserInfoSchema = (roleId) => {
  let schema = {};
  switch (parseInt(roleId)) {
    case RolesEnum.ADMIN: 
    schema = new adminInfoSchema({
      id: body._id,
      email: body.email,
      userName: body.userName,
      role: body.role
    });
    break;
    case RolesEnum.STUDENT: 
    schema = new studentInfoSchema({
      id: body._id,
      email: body.email,
      userName: body.userName,
      role: body.role
    });
    break;
    case RolesEnum.COACH: 
    schema = new coachInfoSchema({
      id: body._id,
      email: body.email,
      userName: body.userName,
      role: body.role
    });
    break;
    case RolesEnum.PARENT: 
    schema = new parentInfoSchema({
      id: body._id,
      email: body.email,
      userName: body.userName,
      role: body.role
    });
    break;
  }
  return schema;
}

userLoggerTasks = (msg, task, userId) => {
  userTasksLogger.info(msg,
  {
    userId,
    taskId: task.id,
    taskTitle: task.title,
    taskDescription: task.description,
    taskReward: task.reward,
    taskCourse: task.course,
    taskStatus: task.status
  }
)}
