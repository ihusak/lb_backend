const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const homeworkSchema = new Schema({
  id: String,
  student: {
    id: String,
    name: String
  },
  name: String,
  description: String,
  createdDate: Date
});

module.exports = mongoose.model('Homework', homeworkSchema);