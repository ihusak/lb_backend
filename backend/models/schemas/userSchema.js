const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: String,
  email: String,
  userPassword: String,
  userType: {
    title: String,
    status: Boolean,
    id: Number
  },
  createdDate: { type: Date, default: Date.now },
  role: Object,
  confirmed: {type: Boolean, default: false}
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