const cron = require('node-cron');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');
const { ObjectID } = require('mongodb');

exports.deleteExpiredToken = cron.schedule('* * 23 * * *', () => {
  console.log('running a task every day');
  const currentTime = Date.now().valueOf();
  db.get().collection('tokens').find({}).toArray((err, tokens) => {
    const expiredTokens = tokens.filter(token => {
      let expiredRefresh = false;
      jwt.verify(token.refreshToken, config.refreshToken, (err) => {
        if(err && err.message === 'jwt expired') expiredRefresh = true;
      });
      return expiredRefresh;
    }).map(t => new ObjectID(t._id));
    db.get().collection('tokens').deleteMany({_id: {$in: expiredTokens}});
  })
});