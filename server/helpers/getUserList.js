const users = require("../models/user");

module.exports.getUsersList = async (req, res) => {
    try {
        const userList = await users.find({}).select({ "firstName": 1, "lastName": 1, "middleName": 1, "userCode": 1 });
        res.status(200).json({ success: "true", data: userList });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: "false", error: `${error}` });
    }
}