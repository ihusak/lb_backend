const jwt = require('jsonwebtoken');
const config = require('../../../config.json');

exports.authUser = (req, res, next) => {
  const userSession = req.cookies['lb_config'];
  if(userSession == null) return res.sendStatus(401);
  jwt.verify(userSession, config.accessToken, (err, user) => {
    if(err) return res.sendStatus(403);
    req.user = user;
    next();
  })
}
