const mongoose = require("mongoose");
require("dotenv").config();

module.exports = async () => {
  try {
    mongoose.set("strictQuery", true);
    mongoose.connect(process.env.MONGO_URL, () => {
      console.log("database connected");
    });
  } catch (error) {
    console.log("error in database connection", error.message);
  }
};
