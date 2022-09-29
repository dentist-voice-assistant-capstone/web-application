const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'User must have email'],
    unique: true,
    validate: [validator.isEmail, 'Your email is invalid']
  },
  password: {
    type: String,
    required: [true, 'User must have password']
  },
  dentist_name: String,
  dentist_surname: String,
  dentist_ID: String
});

const User = mongoose.model('User', userSchema);
module.exports = User;
