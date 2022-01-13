const genericContact = require("../models/genericContact");

var globalId = 0;

const getId = async () => {
    const user = await genericContact.find().sort({'genericId': -1}).limit(1);
    if(user[0]){
        globalId = user[0].genericId;
    }
}
getId();

exports.createOne = async(req, res) => {
    try{
        globalId++;
        const genericId = globalId;
        const {name, email, message} = req.body;
        const newEntry = await genericContact.create({
            genericId, name, email, message,
        })
        return res.status(200).send(newEntry);
    }catch(error){
        console.log(error);
        return res.status(404).send(error);
    }  
}
