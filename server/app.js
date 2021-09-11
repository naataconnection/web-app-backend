require("dotenv").config();
const express = require('express');
const db = require("./db.js");
const app = express();


app.use(express.json());

app.get('/',(req,res)=>{
	res.send('<h1>Helloooo</h1>');

});

app.listen(process.env.PORT, () =>{
	console.log("Server is running");
});

