const registerModel = require("../database/models/registerModel.js");
const bcrypt = require("bcrypt");

module.exports.register = async (req, resp) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await registerModel.findOne({ username });
    if (usernameCheck) {
      return resp.json({ status: 401, msg: "username already exist" });
    }
    const emailCheck = await registerModel.findOne({ email });
    if (emailCheck) {
      return resp.json({ status: 401, msg: "email already exist" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await registerModel.create({
      email,
      username,
      password: hashedPass,
    });
    return resp.status(201).json({
      status: 201,
      msg: "user registered successfully",
      data: user,
    });
  } catch (error) {
    console.log("error in registration", error.message);
  }
};
