module.exports = errorHandler;

function errorHandler(err, req, res, next) {
  console.log('errorHandler', err);
    if (typeof (err) === 'string') {
        // custom application error
        return res.sendStatus(400).json({ message: err });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return res.sendStatus(400).json({ message: err.message });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.sendStatus(401).json({ message: 'Invalid Token' });
    }

    if(err.name === 'User already exist') {
      return res.status(err.code).json({ message: 'User already exist' });
    }

    if(err.name === 'Not confirmed') {
      return res.status(err.code).json({ message: 'User not confirmed' });
    }

    if(err.name === 'Not registred') {
      return res.status(err.code).json({ message: 'User Not registred' });
    }

    if(err.name === 'Wrong password') {
      return res.status(err.code).json({ message: err.name });
    }

    // default to 500 server error
    return res.sendStatus(500).json({ message: err.message });
}