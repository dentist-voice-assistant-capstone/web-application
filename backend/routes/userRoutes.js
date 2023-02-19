const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.patch(
  "/updateProfile",
  authController.protect,
  userController.updateProfile
);

router.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);

router.get("/userInfo", authController.protect, authController.getUserInfo);

router.post("/sendFile", authController.protect, authController.sendFile);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.post("/sendEmailConfirm", authController.sendEmailConfirm);
router.patch("/activateAccount/:token", authController.activateAccount);

router.post("/sendReportExcel", authController.sendReportExcel);

module.exports = router;
