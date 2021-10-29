const fs = require("fs");
const uploadFile = require("../utils/gCloud").uploadFile;

const gCloudUrl = async (path, folderName) => {
	const filePath = path.replace('\\', '/');
	const localDestFilePath = __dirname + "/../../public/profile/" + filePath.substring(filePath.lastIndexOf('\\') + 1);
	const filedestPath = folderName + filePath.substring(filePath.lastIndexOf('\\') + 1);
	let fileUrl = uploadFile(localDestFilePath, filedestPath);
	fileUrl = await Promise.all([fileUrl]);
	fs.unlinkSync(localDestFilePath);
	return fileUrl[0];
}

module.exports = {
    gCloudUrl
}