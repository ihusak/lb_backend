const Users = require('../models/users');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const User = require('../models/schemas/userSchema');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');
const {
  userLoginlogger, 
  requestErrorLogger, 
  userLogoutlogger, 
  mailTransporterLogger
} = require('../config/middleware/logger');
const {createTransporter} = require('../config/email');
const rolesEnum = require('../config/enum/roles');


const salt = bcrypt.genSaltSync(10);

exports.all = (req, res, next) => {
  Users.all((err, docs) => {
    if(err) {
      return res.sendStatus(500);
    }
    res.send(docs);
  })
};

exports.createUser = (req, res, next) => {
  let password = bcrypt.hashSync(req.body.userPassword, salt);
  const request = req.body;
  const user = new User({
    userName: request.userName,
    email: request.email.toLowerCase(),
    userPassword: password, 
    userType: request.userType,
    role: request.userRole
  });
  const host = req.get('origin');
  Users.createUser(user, request.registerToken, request.invited, (err, docs) => {
    if(!docs) {
      const err = {
        errorMessage: 'User already exist',
        errKey: 'USER_ALREADY_EXIST',
        code: 409
      };
      requestErrorLogger.error(`Error ${err.code}`, err);
      return next(err);
    }
    const createdUser = docs.ops[0];
    const sentInviteLetter = request.invited;
    const inviter = {
      name: createdUser.userName,
      email: createdUser.email,
      id: createdUser._id.toString(),
      roleId: createdUser.role.id
    };
    if(err) {
      return res.sendStatus(500);
    }
    sendConfirmUserByEmail(user, host);
    if(sentInviteLetter) {
      sendInviteLetter(sentInviteLetter, inviter, host);
    }
    res.send(user);
  })
};

exports.confirmUser = (req, res, next) => {
  const token = req.params.token;
  Users.confirmUserRegistration(token, (err, doc) => {
  if(err) return res.sendStatus(500); 
    if(!doc) {
      const err = {
        errorMessage: 'Could not confirm user',
        errKey: 'NOT_FIND_USER_TO_CONFIRM',
        code: 404
      };
      requestErrorLogger.error(`Error ${err.code}`, err);
      return next(err);
    }  
    res.send(doc);
  })
}

exports.deleteUser = (req, res) => {
  let userId = {'_id': new ObjectID(req.user.id)};
  Users.deleteUser(userId, (err, doc) => {
    if(err) {
      return res.sendStatus(500);
    }
    res.send('Note ' + req.params.id + ' deleted!');
  })
};

exports.getUserById = (req, res) => {
  let userId = {'_id': new ObjectID(req.params.id)};
  Users.getUserById(userId, (err, doc) => {
    if(err) {
      return res.sendStatus(500);
    }
    delete doc.userPassword;
    res.send(doc);
  })
};

exports.loginUser = (req, res, next) => {
  const user = {email: req.body.email, userPassword: bcrypt.hashSync(req.body.userPassword, salt)};
  Users.loginUser(user, (err, matchUser, tokens) => {
    if(err) {
      return res.sendStatus(500);
    };
    if(!matchUser) {
      const err = {
        errorMessage: 'Not registered user',
        errKey: 'USER_NOT_REGISTERED',
        code: 400
      };
      requestErrorLogger.error(`Error ${err.code}`, err);
      return next(err);
    }
    if(!matchUser.confirmed) {
      const err = {
        errorMessage: 'Not confirmed user',
        errKey: 'USER_NOT_CONFIRMED',
        code: 426
      };
      requestErrorLogger.error(`Error ${err.code}`, err);
      return next(err);
    };
    let passwordMatch = bcrypt.compareSync(req.body.userPassword, matchUser.userPassword) && matchUser.email === user.email;
    if(matchUser) {
      delete matchUser.userPassword;
      matchUser.tokens = tokens;
      matchUser.id = matchUser._id;
      delete matchUser._id;
      if(passwordMatch) {
        userLoginlogger.info(`User logged in ${matchUser.userName}`, {id: matchUser.id, email: matchUser.email});
        res.send(matchUser);
      } else {
        const err = {
          errorMessage: 'Wrong user password',
          errKey: 'WRONG_PASSWORD',
          code: 400
        };
        requestErrorLogger.error(`Error ${err.code}`, {err, matchUser});
        return next(err);
      }
    }
  })
};
exports.logoutUser = (req, res) => {
  let userId = req.user.id;
  Users.logoutUser(req.body.token, userId, (err, docs) => {
    if(err) {
      return res.sendStatus(500);
    }
    userLogoutlogger.info(`User logged out`, req.user);
    res.send({message:'logout!'});
  })
}

exports.updateUser = (req, res) => {
  let userId = {'_id': new ObjectID(req.user.id)};
  const user = {name: req.body.name, surname: req.body.surname};
  Users.updateUser(user, userId, (err, doc) => {
    if(err) {
      return res.sendStatus(500);
    }
    res.send('Note ' + req.params.id + ' UPDATED!');
  })
};

exports.userRefreshToken = (req, res) => {
  const user = req.user;
  Users.userRefreshToken(user, (err, accessToken, refreshToken) => {
    if(err) return res.sendStatus(500);
    return res.json({accessToken, refreshToken});
  })
};

exports.recoveryPassword = (req, res, next) => {
  const newPassword = bcrypt.hashSync(req.body.newPassword, salt);
  const passwordRecoveryData = {
    email: req.body.email,
    newPassword
  };
  const host = req.get('origin');
  Users.recoverPassword(passwordRecoveryData, (err, result) => {
    if(err) return res.sendStatus(500);
    if(!result) {
      const err = {
        errorMessage: 'Used not found',
        errKey: 'USER_NOT_FOUND',
        code: 400
      };
      requestErrorLogger.error(`Error reset password ${err.code}`, {err, email: req.body.email});
      return next(err);
    };
    sentRecoveredPassword({email: req.body.email, newPassword: req.body.newPassword}, host);
    return res.json({result: 'ok', status: 'accept'});
  })
};

exports.invite = (req, res, next) => {
  const invitedPersons = req.body.emails;
  const inviter = req.body.inviter;
  const host = req.get('origin');
  if(invitedPersons.length) {
    invitedPersons.forEach((invitedPerson) => {
      sendInviteLetter(invitedPerson, inviter, host);
    });
    return res.json({status: 'sent', ok: true});
  }
}

sendConfirmUserByEmail = async (createdUser, host) => {
  const transporter = await createTransporter();
  const emailToken = jwt.sign(
    {
      user: createdUser._id
    },
    config.emailSercet,
    {
      expiresIn: '1d'
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
    to: createdUser.email, // list of receivers
    subject: 'Подтверждение регестрации', // Subject line 
    html: `<p>Что бы активировать профиль ${createdUser.userName} нажмите <a href='${url}'>Подтвердить регистрацию</a></p>`,
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

sentRecoveredPassword = async (recoveryData, host) => {
  const transporter = await createTransporter();
  if(host.indexOf('local') >= 0) {
    host = host;
  } else {
    host = 'https://lb.afreestylers.com';
  }
  const mailOptions = {
    from: 'afreestylers2016@gmail.com', // sender address
    to: recoveryData.email, // list of receivers
    subject: 'Обновление пароля', // Subject line 
    html: `<p>Ваш пароль только что был обновлен. Новый пароль (${recoveryData.newPassword})</p>`,
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

sendInviteLetter = async (invitedPerson, inviter, host) => {
  const transporter = await createTransporter();
  console.log('letter inviter', inviter);
  const emailsToken = jwt.sign(
      {
        inviter: inviter,
        invitedPerson: invitedPerson
      },
      config.emailSercet,
      {
        expiresIn: '7d'
      }
  );
  if(host.indexOf('local') >= 0) {
    host = host;
  } else {
    host = 'https://lb.afreestylers.com';
  }
  const roleToRegister = inviter.roleId === rolesEnum.PARENT ? rolesEnum.STUDENT : rolesEnum.PARENT;
  const url = `${host}/register?token=${emailsToken}&roleId=${roleToRegister}&email=${invitedPerson}`;
  const mailOptions = {
    from: 'afreestylers2016@gmail.com', // sender address
    to: invitedPerson, // list of receivers
    subject: 'Приглашение о регистрации на lb.afreestylers.com', // Subject line
    html: `<p>Вам было отправленно приглашение на регистрацию от пользователя <b>${inviter.name}</b> (${inviter.email}), что бы зарегестрироваться перейдите по ссылке (<a href='${url}'>Регистрация по приглашению</a>)</p>`,
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


