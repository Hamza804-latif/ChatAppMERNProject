const messageModel = require("../database/models/messageModel.js");

module.exports.addMsg = async (req, resp) => {
  try {
    const { from, to, message } = req.body;
    const data = await messageModel.create({
      messages: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      return resp.status(201).json({ status: 201 });
    } else {
      return resp.send({
        status: 500,
        msg: "something went wrong failed to add message to database",
      });
    }
  } catch (error) {
    return console.log("error in add message", error.message);
  }
};
module.exports.getAllMsg = async (req, resp) => {
  try {
    const { from, to } = req.body;
    const messages = await messageModel
      .find({ users: { $all: [from, to] } })
      .sort({ updatedAt: 1 });

    if (messages) {
      const projectMessages = messages.map((msg) => {
        return {
          fromSelf: msg.sender.toString() === from,
          message: msg.messages.text,
        };
      });
      return resp.status(200).json({ status: 200, data: projectMessages });
    }
  } catch (error) {
    return console.log("error in grt mmessages", error.message);
  }
};
