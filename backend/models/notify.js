const db = require('../config/db');
const Notify = require('../models/schemas/notifyScheme');
const notifyTypes = require('../config/enum/notify');
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;
const subscriptions = [];

exports.readNotify = (userId, notifyId, cb) => {
  //{users: {$elemMatch: {id: userId}, $unset: {id: userId}}}
  let notifyObjectId = {'_id': new ObjectID(notifyId)};
  db.get().collection('notifications').findOneAndUpdate(notifyObjectId, {$pull: {users: {id: userId}}}, (err, notification) => {
    if(notification.value.users.length <= 1) {
      db.get().collection('notifications').deleteOne(notifyObjectId);
    }
    cb(err, notification);
  });
}

exports.sendNotify = (notify, cb) => {
  const NOTIFY = new Notify(notify);
  if(!NOTIFY.users) {
    userRoleNotifications(NOTIFY, cb);
  } else {
    setNotification(NOTIFY, cb);
  }
};

exports.getDefaultNotify = (roleId, userId, cb) => {
  db.get().collection('notifications').find({}).toArray((err, notifications) => {
    let mapped = notifications.filter(n => n.users.find(u => u.id === userId)).map(notify => {
      delete notify.users;
      return notify;
    });
    cb(err, mapped);
  });
};


// exports.getNotification = (type, cb) => {
//   console.log('type', type);
//   db.get().collection('notifications').find({}).toArray((err, responseNotifications) => {
//     if(type !== 'all') {
//       responseNotifications = responseNotifications.filter((notify) => notify.type === type);
//     }
//     let mappedNotifyes = responseNotifications.map((n) => {
//       let updateNotify = n;
//       updateNotify.id = updateNotify._id;
//       delete updateNotify._id;
//       return updateNotify;
//     });
//     console.log('mappedNotifyes', mappedNotifyes);
//     cb(err, mappedNotifyes);
//   });
// };

exports.publish = (data) => {
  subscriptions.forEach(subscriber => subscriber(data));
}

exports.onNotifyEnd = (cb) => {
  subscriptions.push(cb);
}
exports.unsubscribe = (cb) => {
  subscriptions.forEach((subscriber, i) => {
    if(subscriber === cb) {
      subscriptions.splice(subscriptions.indexOf(subscriptions[i]));
    }
  });
}
exports.userHasPermission = (type, userRole) => {
  return notifyTypes[userRole].find((notifyAllow) => notifyAllow === type);
}

setNotification = (notify, cb) => {
  db.get().collection('notifications').insertOne(notify, (err, doc) => {
    cb(err, doc);
  });
}
userRoleNotifications = (notify, cb) => {
  db.get().collection('users').find({}).toArray((err, users) => {
    notify.users = users.filter(user => notify.userType.find(type => type === user.role.id)).map(user => {
      return {
        id: user._id.toString(),
        name: user.userName
      }
    });
    setNotification(notify, cb);
  })
}
