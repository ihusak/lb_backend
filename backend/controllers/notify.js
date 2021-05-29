const Notify = require('../models/notify');

exports.sendNotify = (req, res) => {
  const notification = req.body.notify;
  Notify.sendNotify(notification, (err, notify) => {
    if(err) return res.sendStatus(500);
    Notify.publish(notify.ops);
    return res.json(notify.ops);
  });
}
exports.getNotificationLongPoll = (req, res) => {
  const ROLE_ID = JSON.stringify(req.user.roleId);
  const USER_ID = JSON.stringify(req.user.id);
  const TYPE = req.params.type;
  const callback = (data) => {
    let notify = data[0];
    let userHasNotification;
    if (notify.users) {
      userHasNotification = notify.users.find(user => {
        return JSON.stringify(user.id) === USER_ID;
      })
    }
    if(ROLE_ID === notify.userType && userHasNotification) {
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
  const TYPE = req.params.type;
  const USER_ID = req.user.id;
  const ROLE_ID = req.user.roleId;
  Notify.getDefaultNotify(TYPE, ROLE_ID, USER_ID, (err, notifications) => {
    if(err) return res.sendStatus(500);
    return res.json(notifications);
  });
}

