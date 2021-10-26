const gc = require("../config/gc");
require('dotenv').config()

const bucket = gc.bucket(process.env.GOOGLEBUCKET_KEY || "naata_connection");

const uploadFile = async (filePath, destFileName) => {
    return new Promise((resolve,reject) => {
        bucket.upload(filePath, {
            destination: destFileName,
        }, (err, file) => {
            if (err) {
                reject(err)
            }
            resolve("https://storage.googleapis.com/"+ bucket.name + "/" + destFileName);
        });
    }) 
}

const deleteFile = async (destFileName) => {
    return new Promise((resolve,reject) => {
        console.log(destFileName);
        bucket.file(destFileName).delete((err, file) => {
            if (err) {
                reject(err)
            }
            resolve("delete the file" + destFileName);
        });
    }) 
}

module.exports = {
    uploadFile,
    deleteFile
}
