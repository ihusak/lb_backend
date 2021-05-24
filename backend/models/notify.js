const db = require('../config/db');
const Notify = require('../models/schemas/notifyScheme')

exports.sendNotify = (notify, cb) => {
  const NOTIFY = new Notify(notify);
  db.get().collection('notifications').insertOne(NOTIFY, (err, doc) => {
    cb(err, doc);
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