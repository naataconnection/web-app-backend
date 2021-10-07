const request = require("request");
require("dotenv").config();

const fleethuntbyid = (vehicleId) => {
    let apiKey = process.env.FLEETHUNT_API_KEY;
    let URL = "https://www.fleethunt.in/api/locate" + "?device_id=" + vehicleId + "api_token=" + apiKey;
    var options = {
        method: "GET",
        url: URL,
        headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
        },
        json: true
    }
    return new Promise((resolve, reject) => {
        request(options, function (error, response) {
            if (error) reject(error);
            resolve(response);
        });
    });
};

const fleethuntAllUser = () => {
    let apiKey = process.env.FLEETHUNT_API_KEY;
    let URL = "https://www.fleethunt.in/api/fleet" + "?api_token=" + apiKey;
    var options = {
        method: "GET",
        url: URL,
        headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
        },
        json: true
    }
    return new Promise((resolve, reject) => {
        request(options, function (error, response) {
            if (error) reject(error);
            resolve(response);
        });
    });
};

module.exports = {
    fleethuntAllUser,
    fleethuntbyid,
}