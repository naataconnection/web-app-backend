const fs = require("fs");
const path = require('path');
const uploadFile = require("../utils/gCloud").uploadFile;

const gCloudUrl = async (localPath, folderName) => {
	const filePath = localPath.replace('\\', '/');
	const filedestPath = folderName + filePath.substring(filePath.lastIndexOf('/') + 1);
	let fileUrl = uploadFile(filePath, filedestPath);
	fileUrl = await Promise.all([fileUrl]);
	fs.unlinkSync(filePath);
	return fileUrl[0];
}

module.exports = {
    gCloudUrl
}