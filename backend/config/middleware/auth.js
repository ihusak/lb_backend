const jwt = require('jsonwebtoken');
const config = require('../../../config.json');

exports.authUser = (req, res, next) => {
  console.log('middle', req.cookies['lb_config']);
  const userSession = req.cookies['lb_config'];
  if(userSession == null) return res.sendStatus(401);
  jwt.verify(userSession, config.accessToken, (err, user) => {
    console.log('auth error', err);
    if(err) return res.sendStatus(403);
    req.user = user;
    next();
  })
}
