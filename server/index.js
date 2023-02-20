require("dotenv").config();
const express = require("express");
const cors = require("cors");
const database = require("./database/config.js");
const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require("./routes/authRoutes.js");

const NodeServer = async () => {
  await database();
  app.use(cors());
  app.use(express.json());
  app.use("/api/auth", authRoutes);
  try {
    app.listen(8000, () => {
      console.log(`Server is live on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("error on server running", error.message);
  }
};

NodeServer();
