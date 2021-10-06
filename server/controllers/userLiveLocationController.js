const userStat = require("../models/userStat");
const geolocation = require("../utils/geoLocation");

module.exports.updateLiveLocation = async (req, res) => {
    try{
        var final = [];
        const result = await userStat.find({});
        for(var i = 0;i < result.length; i++){
            if(result[i].currLatitude !== null && result[i].currLongitude !== null){
                const location = await geolocation.location({ ip: result[i].ipAddress});
                const doc = await userStat.findOneAndUpdate(
                    {ipAddress: result[i].ipAddress }, 
                    {currLatitude: location.body.latitude, 
                    currLongitude: location.body.longitude},
                    {new: true}
                );
                const latitude = doc.currLatitude;
                const longitude = doc.currLongitude;
                final[result[i].userCode] = {latitude, longitude};
            }else{
                console.log("Archana");
                final[result[i].userCode] = {};
            }
        }
        res.status(200).json({
            status: 'success',
            data: Object.assign({}, final)
        });
    }catch(error){
        console.log(error);
        res.status(400).json({ success: "false", error: `${error}` });
    }
}