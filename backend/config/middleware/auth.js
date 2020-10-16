const jwt = require('jsonwebtoken');
const config = require('../../../config.json');

exports.authUser = (req, res, next) => {
  console.log('middle', req.cookies.lb_config);
  const userSession = req.cookies['lb_config'];
  // const authHeader = req.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1];
  if(userSession == null) return res.sendStatus(401);
  jwt.verify(userSession, config.accessToken, (err, user) => {
    if(err) return res.sendStatus(403);
    console.log('JWT SIGN', user);
    req.user = user;
    next();
  })
}
