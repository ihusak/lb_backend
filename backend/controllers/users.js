const Users = require('../models/users');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const User = require('../models/schemas/userSchema');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');
const nodemailer = require('nodemailer');
const {userlogger, requestErrorLogger} = require('../config/middleware/logger');
const PORT = process.env.PORT || 8000;
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: 'afreestylers2016@gmail.com',
    // pass: 'afreestylers2016'
    clientId: '305454854425-finc9u6im5elcfjbh49bqam5j29vnk8r.apps.googleusercontent.com',
    clientSecret: 'SbxKuATW-CuBEaHSSL3sb-B-',
    refreshToken: '1//04XO_rG9BWqAqCgYIARAAGAQSNwF-L9IrGlFYCqZdRej2I4DPesT1gZij8jwN-xLEEKR9Cn0l1ug5Oo2OLzrtticbNeS7iou1qto',
    accessToken: 'ya29.a0AfH6SMAQSMCS1SZxu2jSvlLTFDu35RQI6qWqbqhXbgSlC8fwASUWV6Dj7-tz-s6V_LTaoPbnVmigFL-xqaPGkoIlhhQ46Wdwn8V_9CuO1elfxxdYNTV0QyitkoTnxlSjVdTSSsoul16QRD4K2_NVVulN-1VJmZ4mRdK7ba-4EQU',
    expires: 3599
  }
});

const salt = bcrypt.genSaltSync(10);

exports.all = (req, res) => {
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
  const host = req.get('host');
  Users.createUser(user, (err, docs) => {
    if(err) {
      return res.sendStatus(500);
    } 
    if(!docs) {
      const err = {name: 'User already exist', title: 'User', code: 409};
      return next(err);
    };
    sendConfirmUserByEmail(user, host);
    res.send(user);
  })
};

exports.confirmUser = (req, res, next) => {
  const token = req.params.token;
  Users.confirmUserRegistration(token, (err, doc) => {
  if(err) return res.sendStatus(500); 
    if(!doc) {
      const err = {name: 'Not confirmed', title: 'User', code: 409};
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
    console.log('matchUser', matchUser, err);
    if(err) {
      return res.sendStatus(500);
    };
    if(!matchUser) {
      const err = {name: 'Not registred', title: 'User', code: 404};
      return next(err);
    }
    if(!matchUser.confirmed) {
      const err = {name: 'Not confirmed', title: 'User', code: 409};
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
        const err = {name: 'Wrong password', title: 'User', code: 400};
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

exports.userToken = (req, res) => {
  const refreshToken = req.body.refreshToken;
  Users.userToken((err, tokens, jwt, config, generateToken) => {
    if(err) return res.sendStatus(500);
    if(refreshToken == null) return res.sendStatus(401);
    if(!tokens.some(t => t.refreshToken == refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, config.refreshToken, (err, user) => {
      if(err) return res.sendStatus(403);
      const accessToken = generateToken({name: user.name});
      return res.json({accessToken});
    })
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
    host = 'http://' + host;
  } else {
    host = 'http://lb.afreestylers.com/';
  }
  const url = `${host}/confirm/${emailToken}`;
  const mailOptions = {
    from: 'afreestylers2016@gmail.com', // sender address
    to: createdUser.email, // list of receivers
    subject: 'Подтверждение регестрации', // Subject line 
    html: `<p>Что бы активировать профиль ${createdUser.userName} нажмите <a href='${url}'>Подтвердить регистрацию</a></p>`// plain text body
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if(err)
      console.log(err)
    else
      console.log(info);
 });
}
