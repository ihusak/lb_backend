const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: String,
  email: String,
  userPassword: String,
  userType: String,
  createdDate: { type: Date, default: Date.now },
  role: Object
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
      delete ret._id;
      // delete ret.hash;
  }
});

module.exports = mongoose.model('User', userSchema);