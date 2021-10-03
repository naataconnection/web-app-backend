const request = require('request');
require("dotenv").config();

function getoptions({ip} = {}){
  return {
    method: 'GET',
    url: 'http://ipwhois.app/json/' + ip,
    headers: {
      'x-rapidapi-host': process.env.GEO_LOCATION_HOST,
      'x-rapidapi-key': process.env.GEO_LOCATION_API_KEY,
      useQueryString: true
    },
    json: true
  }
};

module.exports = {
  location: function ({ip} = {}){
    let options = getoptions({ip});
    return new Promise((resolve, reject) => {
      request(options, function (error, response) {
        if (error) reject(error);
        resolve(response);
      });
    })
   
  }
  
}

