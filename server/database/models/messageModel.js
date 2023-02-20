const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    messages: {
      text: {
        type: String,
        require: true,
      },
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("messages", messageSchema);
