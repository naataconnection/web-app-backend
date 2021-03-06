const fs = require("fs");
const { exec } = require("child_process");
const uploadFile = require("../utils/gCloud").uploadFile;
var path = require('path');
var mongoose = require('mongoose');
const AdmZip = require('adm-zip');
const zip = new AdmZip();

module.exports.exportDB = (req, res) => {
  exec("mongodump", async(error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return res.status(400).json({ success: "false", error: `${error}`});
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
    var collections = mongoose.connections[0].collections;
    var lists = [];

    Object.keys(collections).forEach(function(k) {
        lists.push(k);
    });
    var localPath = path.join(__dirname, '..', '..', 'dump', 'testDB');
    for(let i = 0;i < lists.length; i++){
      zip.addLocalFile('./dump/testDB/' + lists[i] + '.bson');
      zip.addLocalFile('./dump/testDB/' + lists[i] + '.metadata.json');
      fs.unlinkSync(localPath + "/" + lists[i] + '.bson');
      fs.unlinkSync(localPath + "/" + lists[i] + '.metadata.json');
    }

    const fileName = 'NaataConnection_database_' + new Date().getTime() + '.zip';
    fs.writeFileSync( localPath + "/" + fileName, zip.toBuffer());
    const filedestPath = "db/" + fileName;
    let fileUrl = uploadFile(localPath + "/" + fileName, filedestPath);
    fileUrl = await Promise.all([fileUrl]);
    fs.unlinkSync(localPath + "/" + fileName);
    return res.status(200).json({ success: "true", message: "Command executed", url: fileUrl[0]});
  });  
  
}
