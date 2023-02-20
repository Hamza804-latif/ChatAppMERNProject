const registerModel = require("../database/models/registerModel.js");
const bcrypt = require("bcrypt");

module.exports.register = async (req, resp) => {
  try {
    console.log("req.body", req.body);
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
    return console.log("error in registration", error.message);
  }
};

module.exports.login = async (req, resp) => {
  try {
    let { username, password } = req.body;
    const userCheck = await registerModel.findOne({ username });
    if (!userCheck) {
      return resp.json({ status: 401, msg: "Incorrect username or password" });
    }

    const passwordCheck = await bcrypt.compare(password, userCheck?.password);

    if (!passwordCheck) {
      return resp.json({ status: 401, msg: "Incorrect username or password" });
    }
    return resp
      .status(200)
      .json({ status: 200, msg: "Login Successfull", data: userCheck });
  } catch (error) {
    return console.log("error in registration", error.message);
  }
};

module.exports.setAvatar = async (req, resp) => {
  try {
    let userId = req.params.id;
    let avatarImage = req.body.image;
    let userData = await registerModel.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });
    if (userData) {
      return resp.status(201).json({
        status: 201,
        msg: "Profile image saved successfully",
        data: { image: userData.avatarImage },
      });
    }
    return;
  } catch (error) {
    resp.json({ status: 500, msg: "Server error" });
    return console.log("error in avatar api", error.message);
  }
};
module.exports.allUsers = async (req, resp) => {
  try {
    const userData = await registerModel.find({ _id: { $ne: req.params.id } });

    if (userData.length !== 0) {
      return resp.status(200).json({ status: 200, data: userData });
    } else {
      return resp.json({ status: 404, msg: "No users found" });
    }
  } catch (error) {
    return console.log("error in all users", error.message);
  }
};
