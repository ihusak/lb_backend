const Notify = require('../models/notify');

exports.sendNotify = (req, res) => {
  const notification = req.body.notify;
  Notify.sendNotify(notification, (err, notify) => {
    if(err) return res.sendStatus(500);
    return res.json(notify);
  });
}
exports.getNotification = (req, res) => {
  const TYPE = req.params.type;
  Notify.getNotification(TYPE, (err, notify) => {
    if(err) return res.sendStatus(500);
    return res.json(notify);
  });
}