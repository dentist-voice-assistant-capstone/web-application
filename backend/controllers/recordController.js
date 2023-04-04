const catchAsync = require("./../utils/catchAsync");
const Record = require("./../models/recordModel");

exports.getRecordData = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const recordData = await Record.findOne({ userId: userId });
  res.status(200).json({
    status: "success",
    data: recordData,
  });
});

exports.updateRecordData = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const recordData = await Record.findOneAndUpdate(
    { userId: userId },
    { ...req.body, timestamp: Date.now() },
    { new: true, upsert: true }
  );
  res.status(200).json({
    status: "success",
    data: recordData,
  });
});

exports.deleteRecordData = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const deletedData = await Record.findOneAndDelete({ userId: userId });
  res.status(200).json({
    status: "success",
    data: deletedData,
  });
});
