const db = require('../config/db');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');
const RecoveryPass = require('./schemas/recoveryPassSchema');

exports.recovery = (email, password, cb) => {
    db.get().collection('users').findOneAndUpdate({'email': email}, {$set: {'userPassword': password}}, (err, doc) => {
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
                cb(err, doc.ops[0]);
            })
        } else {
            cb(err, null);
        }
    })

}

exports.confirm = (token, codeSent, cb) => {
    db.get().collection('recovery-pass').findOne({'token': token}, (err, doc) => {
        const {email, code} = jwt.verify(doc, config.passSecret);
        if(codeSent === code) {
            cb(err, {success: true});
        } else {
            cb(err, {success: false});
        }

    })
}
