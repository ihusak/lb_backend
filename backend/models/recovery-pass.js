const db = require('../config/db');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');
const RecoveryPass = require('./schemas/recoveryPassSchema');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);


exports.recovery = (password, token, cb) => {
  let HASHED_PASSWORD = bcrypt.hashSync(password, salt);
  const {email, code} = jwt.verify(token, config.passSecret);
  db.get().collection('users').findOneAndUpdate({'email': email}, {$set: {'userPassword': HASHED_PASSWORD}}, (err, doc) => {
      cb(err, doc);
  });
}

exports.remind = (email, cb) => {
    const code = Math.floor(100000 + Math.random() * 900000);
    const createdToken =  jwt.sign(
        {
            email: email,
            code: code
        },
        config.passSecret,
        {
            expiresIn: '5m'
        }
    );
    const recoveryParams = new RecoveryPass({
        token: createdToken,
        code: code
    });
    db.get().collection('users').findOne({'email': email}, (err, result) => {
        if(result) {
            db.get().collection('recovery-pass').insertOne(recoveryParams, (err, doc) => {
                cb(err, recoveryParams);
            })
        } else {
            cb(err, null);
        }
    })

}

exports.confirm = (token, codeSent, cb) => {
    db.get().collection('recovery-pass').findOne({'token': token}, (err, doc) => {
      const {email, code} = jwt.verify(doc.token, config.passSecret, (err) => {
        if(err) {
          cb(err, {success: false});
        }
        if(codeSent === doc.code) {
          cb(err, {success: true});
      } else {
          cb(err, {success: false});
      }
      });
    })
}

exports.resend = (token, cb) => {
    const newCode = Math.floor(100000 + Math.random() * 900000);
    const {email, code} = jwt.verify(token, config.passSecret);
    const createdToken =  jwt.sign(
        {
            email: email,
            code: newCode
        },
        config.passSecret,
        {
            expiresIn: '5m'
        }
    );
    db.get().collection('recovery-pass').findOneAndUpdate({'token': token}, {$set: {'code': newCode, 'token': createdToken}}, (err, doc) => {
        cb(err, {result: doc, email, newCode, createdToken});
    });
}
