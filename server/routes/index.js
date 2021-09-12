const express = require("express");
const controllers = require('../controllers/controllers');

const router = express.Router();

router.get("/",(req,res)=>{
	res.send("<h2>hello</h2>");
});
router.post('/responseEmail', controllers.responseEmail);
router.post('/registerUser', controllers.registerUser);
router.post('/loginUser',controllers.loginUser);


module.exports = router;