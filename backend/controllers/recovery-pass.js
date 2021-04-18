const RecoveryPass = require('../models/recovery-pass');

exports.recovery = (req, res) => {
    const password = req.body.password;
    RecoveryPass.recovery(password, (err, token) => {
        if(err) return res.sendStatus(500);
        return res.json({result: 'ok', status: 'updated'});
    })
}

exports.remind = (req, res, next) => {
    const email = req.body.email;
    RecoveryPass.remind(email, (err, result) => {
        let tokenObj;
        if(result) {
            tokenObj = {
                token: result.token
            };
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
