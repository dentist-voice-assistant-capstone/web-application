const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: [true, "User must have an ID"],
    unique: true,
  },
  recordData: {
  },
  timestamp: {
    type: String,
  },
});

const Record = mongoose.model("Record", recordSchema);
module.exports = Record;
