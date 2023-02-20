const { addMsg, getAllMsg } = require("../controllers/messagesController.js");

const router = require("express").Router();

router.post("/addMsg", addMsg);
router.post("/getAllMsg", getAllMsg);

module.exports = router;
