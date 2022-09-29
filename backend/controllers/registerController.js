const User = require('../models/userModel');

exports.createAccount = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
