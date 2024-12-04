const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
  pages: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("File", FileSchema);
