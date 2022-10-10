const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'User must have email'],
    unique: true,
    validate: [validator.isEmail, 'Your email is invalid']
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
  },
  password: {
    type: String,
    required: [true, 'User must have password'],
    minlength: [8, 'Password must have more or equal than 8 characters'],
    maxlength: [12, 'Password must have less or equal than 12 characters'],
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'User must have confirm password'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailConfirmToken: String,
  emailConfirmExpires: Date,
  active: {
    type: Boolean,
    default: false,
    select: false
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  // Generate Salt of lenght 12 and hash.
  this.password = await bcrypt.hash(this.password, 12);

  // Delete confirmPassword field before save.
  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  // If password was change, then set passwordChangeAt to now.
  this.passwordChangeAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^findById/, function(next) {
  // Query only the active account when using function which starts with find.
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  // Check the candidatePassword from the request and the password in the database.
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  // Compare the time when JWT was created and the time when password was changed.
  if (this.passwordChangeAt) {
    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createEmailConfirmToken = function() {
  // Generate Reset Password Token for forget password route.
  const confirmToken = crypto.randomBytes(32).toString('hex');

  this.emailConfirmToken = crypto
    .createHash('sha256')
    .update(confirmToken)
    .digest('hex');

  this.emailConfirmExpires = Date.now() + 10 * 60 * 1000;

  console.log(confirmToken, this.emailConfirmToken);

  return confirmToken;
};

userSchema.methods.createPasswordResetToken = function() {
  // Generate Reset Password Token for forget password route.
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
