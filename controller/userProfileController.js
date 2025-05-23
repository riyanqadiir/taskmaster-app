const UserProfile = require("../model/userProfile.js")

const getUserProfile = async (req, res) => {
    const { _id } = req.user;
    try {
        const profile = await UserProfile.findOne({ userId: _id  });
        if (!profile) {
            return res.status(404).json({ message: "User profile not found" });
        }
        res.status(200).json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const updateUserProfile = async (req, res) => {
    const { _id } = req.user;
    try {
        const updatedProfile = await UserProfile.findOneAndUpdate(
            { userId: _id},
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedProfile) {
            return res.status(404).json({ message: "User profile not found" });
        }
        res.status(200).json(updatedProfile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getUserProfile, updateUserProfile };
