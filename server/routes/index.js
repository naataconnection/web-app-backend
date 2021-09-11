const express = require("express");
const controllers = require('../controllers/controllers');

const router = express.Router();

router.post('/responseEmail', controllers.responseEmail);
router.post('/registerUser', controllers.registerUser);


module.exports = router;