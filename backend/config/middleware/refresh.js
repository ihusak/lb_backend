const jwt = require('jsonwebtoken');
const config = require('../../../config.json');

exports.refreshToken = (req, res, next) => {
    const refreshToken = req.cookies['lb_refreshToken'];
    if(refreshToken == null) return res.sendStatus(401);
    jwt.verify(refreshToken, config.refreshToken, (err, user) => {
        if(err) {
            return res.sendStatus(401);
        }
        req.user = user;
        next();
    })
}
