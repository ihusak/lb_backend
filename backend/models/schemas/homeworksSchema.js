const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const homeworkSchema = new Schema({
  id: String,
  students: [
    {
      id: String,
      name: String
    }
  ],
  title: String,
  description: String,
  example: String,
  reward: Number,
  createdDate: Date
});

module.exports = mongoose.model('Homework', homeworkSchema);