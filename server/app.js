require("dotenv").config();
const express = require('express');
const db = require("./db.js");
const app = express();

const route = require("./routes/index.js");

app.use(express.json());
app.use("/", route);

app.listen(process.env.PORT, () =>{
	console.log("Server is running");
});

