const Users = require('../models/users');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const User = require('../models/schemas/userSchema');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');
const {userlogger, requestErrorLogger} = require('../config/middleware/logger');
const {transporter} = require('../config/email');


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
  const user = new User({
    userName: req.body.userName, 
    email: req.body.email, 
    userPassword: password, 
    userType: req.body.userType,
    role: req.body.userRole
  });
  const host = req.get('origin');
  Users.createUser(user, (err, docs) => {
    if(err) {
      return res.sendStatus(500);
    } 
    if(!docs) {
      const err = {
        errorMessage: 'User already exist',
        errKey: 'USER_ALREADY_EXIST',
        code: 409
      };
      return next(err);
    }
    sendConfirmUserByEmail(user, host);
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
      return next(err);
    }
    if(!matchUser.confirmed) {
      const err = {
        errorMessage: 'Not confirmed user',
        errKey: 'USER_NOT_CONFIRMED',
        code: 426
      };
      return next(err);
    };
    let passwordMatch = bcrypt.compareSync(req.body.userPassword, matchUser.userPassword) && matchUser.email === user.email;
    if(matchUser) {
      delete matchUser.userPassword;
      matchUser.tokens = tokens;
      matchUser.id = matchUser._id;
      delete matchUser._id;
      if(passwordMatch) {
        res.send(matchUser);
      } else {
        const err = {
          errorMessage: 'Wrong user password',
          errKey: 'WRONG_PASSWORD',
          code: 400
        };
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
}

sendConfirmUserByEmail = (createdUser, host) => {
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
    if(err)
      console.log(err)
    else
      console.log(info);
 });
}
