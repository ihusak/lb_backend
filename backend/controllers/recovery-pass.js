const RecoveryPass = require('../models/recovery-pass');
const {createTransporter} = require('../config/email');
const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const {
  mailTransporterLogger
} = require('../config/middleware/logger');

exports.recovery = (req, res) => {
    const password = req.body.password;
    const token = req.body.token;
    RecoveryPass.recovery(password, token, (err) => {
        if(err) return res.sendStatus(500);
        return res.json({result: 'ok', status: 'updated'});
    })
}

exports.remind = (req, res, next) => {
    const email = req.body.email;
    const host = req.get('origin');
    RecoveryPass.remind(email, (err, result) => {
        let tokenObj;
        if(result) {
            tokenObj = {
                token: result.token
            };
            sendSecureCodeForEmailRecovery(email, result.code, host);
        } else {
            const err = {
                errorMessage: 'Not find user',
                errKey: 'NO_USER',
                code: 400
            };
            return next(err);
        }
        console.log('tokenObj', tokenObj);
        if(err) return res.sendStatus(500);
        return res.json(tokenObj);
    })
}

exports.confirm = (req, res) => {
    const code = req.body.code;
    const token = req.body.token;
    RecoveryPass.confirm(token, code, (err, token) => {
        if(err) return res.sendStatus(500);
        return res.json(token);
    })
}

sendSecureCodeForEmailRecovery = async (email, code, host) => {
  const transporter = await createTransporter();
  const emailToken = jwt.sign(
    {
      email,
      code
    },
    config.passSecret,
    {
      expiresIn: '5m'
    }
  );
  if(host.indexOf('local') >= 0) {
    host = host;
  } else {
    host = 'https://lb.afreestylers.com';
  }
  const url = `${host}/confirm/${emailToken}`;
  const mailOptions = {
    from: 'afreestylers2016@gmail.com', // sender address
    to: email, // list of receivers
    subject: 'Подтверждение о смене пароля', // Subject line 
    html: `<p>Код подтверждения <b>${code}</b></p>`,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if(err) {
      mailTransporterLogger.info('Mail sending error', err);
      console.log(err);
    } else {
      mailTransporterLogger.info('Mail sending info', info);
      console.log(info);
    }
 });
};