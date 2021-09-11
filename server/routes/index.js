const express = require("express");
const controllers = require('../controllers/controllers');

const router = express.Router();

router.post('/responseEmail', controllers.responseEmail);


module.exports = router;