const superUsers = require("../models/superUser");

module.exports.getSuperUserProfile = async (req, res) => {
    try {
		const userCode = req.body.userCode;
        const superUser = await superUsers.findOne({userCode: userCode});
		let profile = superUser;
        return res.status(200).json({ success: "true", data: {superUser, profile} });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: "false", error: `${error}` });
    }
}

