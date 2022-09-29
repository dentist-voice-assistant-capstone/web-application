const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.createAccount = catchAsync(async (req, res) => {
  const newUser = await (await User.create(req.body)).toJSON();

  //Delete the password and redundant field
  delete newUser.password;
  delete newUser.__v;

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});
