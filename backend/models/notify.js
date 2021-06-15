const db = require('../config/db');
const Notify = require('../models/schemas/notifyScheme');
const notifyTypes = require('../config/enum/notify')
const subscriptions = [];

exports.sendNotify = (notify, cb) => {
  const NOTIFY = new Notify(notify);
  if(NOTIFY.userType === null) {
    db.get().collection('users').find({}).toArray((err, users) => {
      NOTIFY.users = users.map(user => {
        return {
          id: user._id.toString(),
          name: user.userName
        }
      });
      console.log(users);
      console.log(NOTIFY);
      setNotification(NOTIFY, cb);
    })
  } else {
    setNotification(NOTIFY, cb);
  }
};

exports.getDefaultNotify = (type, roleId, userId, cb) => {
  console.log(type, typeof roleId);
  db.get().collection('notifications').find({}).toArray((err, notifications) => {
    let mapped = notifications.filter(n => n.users.find(u => u.id === userId)).map(notify => {
      notify.id = notify._id;
      delete notify._id;
      delete notify.users;
      delete notify.type;
      return notify;
    });
    console.log(mapped);
    cb(err, mapped);
  });
};


exports.getNotification = (type, cb) => {
  console.log('type', type);
  db.get().collection('notifications').find({}).toArray((err, responseNotifications) => {
    console.log('responseNotifications', responseNotifications);
    if(type !== 'all') {
      responseNotifications = responseNotifications.filter((notify) => notify.type === type);
    }
    let mappedNotifyes = responseNotifications.map((n) => {
      let updateNotify = n;
      updateNotify.id = updateNotify._id;
      delete updateNotify._id;
      return updateNotify;
    });
    console.log('mappedNotifyes', mappedNotifyes);
    cb(err, mappedNotifyes);
  });
};

exports.publish = (data) => {
  subscriptions.forEach(subscriber => subscriber(data));
}

exports.onNotifyEnd = (cb) => {
  console.log(cb, subscriptions);
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

setNotification = (NOTIFY, cb) => {
  db.get().collection('notifications').insertOne(NOTIFY, (err, doc) => {
    cb(err, doc);
  });
}
