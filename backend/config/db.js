const mongoose = require('mongoose');
const state = {
  db: null
};

exports.connect = (url, done) => {
  if(state.db) {
    return done();
  };
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if(err) return done(err);
    state.db = db;
    done();
  });
}

exports.get = () => {
  return state.db;
}