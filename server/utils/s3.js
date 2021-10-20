const fs = require('fs');
const AWS = require('aws-sdk');
require("dotenv").config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


const s3upload = async (fileName) => {
    
     return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, data) => {
            if (err) reject(err);
            const params = {
                Bucket: 'attendancereport', // pass your bucket name
                Key: 'user.xls', // file will be saved as testBucket/contacts.csv
                Body: JSON.stringify(data, null, 2)
            };
            s3.upload(params, function(err, data) {
                if (err){
                    reject(err)
                }else{  
                    console.log(`File uploaded successfully at ${data.Location}`);
                    resolve(data);
                }
            });
        })
     })
}

const s3download = function () {
    const params = {
        Bucket: "attendancereport", // pass your bucket name
        Key: 'contacts.csv', // file will be saved as testBucket/contacts.csv
    };
    return new Promise((resolve, reject) => {
        s3.createBucket({
            Bucket: "attendancereport"        /* Put your bucket name */
        }, function () {
            s3.getObject(params, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    console.log("Successfully dowloaded data from  bucket", data);
                    resolve(data);
                }
            });
        });
    });
}

const s3delete = function () {
    const params = {
        Bucket: "attendancereport", // pass your bucket name
        Key: 'contacts.csv', // file will be saved as testBucket/contacts.csv
    };
    return new Promise((resolve, reject) => {
        s3.createBucket({
            Bucket: "attendancereport"        /* Put your bucket name */
        }, function () {
            s3.deleteObject(params, function (err, data) {
                if (err) console.log(err);
                else
                    console.log(
                        "Successfully deleted file from bucket"
                    );
                console.log(data);
            });
        });
    });
};


module.exports = {
    s3upload,
    s3download,
    s3delete
}