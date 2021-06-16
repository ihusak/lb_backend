const Notify = require('../models/notify');

exports.readNotify = (req, res) => {
  const userId = req.body.userId;
  const notifyId = req.body.notifyId;
  Notify.readNotify(userId, notifyId, (err, notify) => {
    if(err) return res.sendStatus(500);
    return res.json({read: true});
  });
}

exports.sendNotify = (req, res) => {
  const notification = req.body.notify;
  Notify.sendNotify(notification, (err, notify) => {
    if(err) return res.sendStatus(500);
    Notify.publish(notify.ops);
    return res.json(notify.ops);
  });
}
exports.getNotificationLongPoll = (req, res) => {
  const USER_ID = JSON.stringify(req.user.id);
  const callback = (data) => {
    let notify = data[0];
    let userHasNotification;
    if (notify.users) {
      userHasNotification = notify.users.find(user => {
        return JSON.stringify(user.id) === USER_ID;
      })
      if(userHasNotification) {
        res.end(JSON.stringify(data));
      }
    } else {
      res.end(JSON.stringify(data));
    }
  };
  Notify.onNotifyEnd(callback);
  setTimeout(() => {
    Notify.unsubscribe(callback);
    res.end('expired');
  }, 120000)
}
exports.getNotificationByDefault = (req, res) => {
  const USER_ID = req.user.id;
  const ROLE_ID = req.user.roleId;
  Notify.getDefaultNotify(ROLE_ID, USER_ID, (err, notifications) => {
    if(err) return res.sendStatus(500);
    return res.json(notifications);
  });
}

