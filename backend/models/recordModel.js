const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User must have an ID"],
    unique: true,
  },
  patienceId: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  finished: {
    type: Boolean,
    default: false,
  },
  recordData: { type: Object },
});

const Record = mongoose.model("Record", recordSchema);
module.exports = Record;
