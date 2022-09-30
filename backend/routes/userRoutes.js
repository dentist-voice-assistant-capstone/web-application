const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.patch(
  '/updateProfile',
  authController.protect,
  userController.updateProfile
);

router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

module.exports = router;
