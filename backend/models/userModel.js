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
    required: [true, 'User must have password'],
    validate: [validator.isMD5, 'Password was not hash yet'],
    select: false
  },
  dentist_name: {
    type: String,
    maxlength: [45, 'Dentist name must have less or equal than 45 characters'],
    validate: [validator.isAlpha, 'Dentist name must be String']
  },
  dentist_surname: {
    type: String,
    maxlength: [
      45,
      'Dentist surname must have less or equal than 45 characters'
    ],
    validate: [validator.isAlpha, 'Dentist name must be String']
  },
  dentist_ID: {
    type: String,
    maxlength: [45, 'Dentist ID must have less or equal than 45 characters']
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
