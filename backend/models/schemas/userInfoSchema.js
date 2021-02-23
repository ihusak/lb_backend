const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userInfo = new Schema({
  id: String,
  userImg: {type: String, default: ''},
  userName: {type: String, default: ''},
  email: {type: String, default: ''},
  aboutMe: {type: String, default: ''},
  bestTrick: {type: String, default: ''},
  socialNetworks: {
    facebook: {type: String, default: ''},
    instagram: {type: String, default: ''},
  },
  phone: {type: String, default: ''},
  startTraining: {type: Date, default: ''},
  parent: {
    name: {type: String, default: ''},
    email: {type: String, default: ''},
    phone: {type: String, default: ''}
  },
  course: {
    id: {type: Number},
    name: {type: String},
  },
  rating: {type: Number, default: 0},
  progress: {type: Number, default: 0},
  role: {
    id: Number,
    title: String,
    status: Boolean
  },
  currentTask: {
    id: {type: String, default: ''},
    status: {type: String}
  }
});

userInfo.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
      delete ret._id;
  }
});

module.exports = mongoose.model('UserInfo', userInfo);