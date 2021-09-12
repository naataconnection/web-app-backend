const express = require("express");
const controllers = require("../controllers/controllers");

const router = express.Router();

router.post("/responseEmail", controllers.responseEmail);
router.post("/registerUser", controllers.registerUser);

router.get("/", (req, res) => {
  res.send("<h1>Helloooo</h1>");
});

module.exports = router;
