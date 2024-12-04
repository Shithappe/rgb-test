const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);

