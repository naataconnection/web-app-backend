const express =require('express');
const app =express();

app.listen(process.env.PORT || 3000,function(req,res){
	console.log("Server is running");
});

app.get('/',(req,res)=>{
	res.send('<h1>Helloooo</h1>');
	
});

