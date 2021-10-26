const Cloud = require("@google-cloud/storage");
const path = require("path");
const serviceKey = path.join(__dirname, "./secretkey.json");

const { Storage } = Cloud;
const storage = new Storage({
    keyFilename: serviceKey,
    projectId: "weighty-forest-273108",
});

module.exports = storage;
