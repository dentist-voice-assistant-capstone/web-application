const express = require("express");
const recordController = require("./../controllers/recordController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.get("/", authController.protect, recordController.getRecordData);

router.post("/", authController.protect, recordController.updateRecordData);

router.delete("/", authController.protect, recordController.deleteRecordData);

module.exports = router;
