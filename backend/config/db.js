const mongoose = require('mongoose');
const state = {
  db: null
};
const dbCreateCollections = require('../initdb');

exports.connect = (url, done) => {
  if(state.db) {
    return done();
  };
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if(err) return done(err);
    mongoose.connection.db.listCollections().toArray(function(err, names) {
      if (err) {
          console.log(err);
      }
      else {
        let collectionsCount = 0;
          names.forEach(function(e,i,a) {
            if(e.name.indexOf('log') > 0) {
              collectionsCount += 1;
            }
          });
        if(names.length === collectionsCount) {
          console.log('need init db');
          dbCreateCollections.init();
        }
      }
  });
    state.db = db;
    done();
  });
}

exports.get = () => {
  return state.db;
}