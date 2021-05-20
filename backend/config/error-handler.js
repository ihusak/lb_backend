module.exports = errorHandler;

function errorHandler(err, req, res, next) {
  console.log('errorHandler', err);
  switch (err.code) {
    case 204:
      return res.status(err.code).json(err);
    case 400:
      // invalid request credentials
      return res.status(err.code).json(err);
    case 403:
      // jwt authentication error
      return res.status(err.code).json(err);
    case 404:
      // not found
      return res.status(err.code).json(err);
    case 409:
    // Conflict
      return res.status(err.code).json(err);
    case 426:
      // need update
      return res.status(err.code).json(err);
    case 500:
    // need update
    return res.status(err.code).json(err);
  }

    if(err.name === 'User already exist') {
      return res.status(err.code).json({ message: 'User already exist' });
    }

    if(err.name === 'Not confirmed') {
      return res.status(err.code).json({ message: 'User not confirmed' });
    }

    if(err.code === 'Not registred') {
      return res.status(err.code).json({ message: 'User Not registred' });
    }

    if(err.name === 'Wrong password') {
      return res.status(err.code).json({ message: err.name });
    }
}
