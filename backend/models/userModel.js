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
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'User must have confirm password']
  },
  dentistName: {
    type: String,
    maxlength: [45, 'Dentist name must have less or equal than 45 characters'],
    validate: [validator.isAlpha, 'Dentist name must be String']
  },
  dentistSurname: {
    type: String,
    maxlength: [
      45,
      'Dentist surname must have less or equal than 45 characters'
    ],
    validate: [validator.isAlpha, 'Dentist name must be String']
  },
  dentistID: {
    type: String,
    maxlength: [45, 'Dentist ID must have less or equal than 45 characters']
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
