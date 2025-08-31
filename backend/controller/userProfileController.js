const User = require("../model/User.js");
const UserProfile = require("../model/userProfile.js");

const formatUser = (user) => ({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
});

const formatProfile = (profile) => ({
    address: profile.address || "",
    phone: profile.phone || "",
    bio: profile.bio || "",
    interests: profile.interests || [],
    socialLinks: profile.socialLinks || {},
});

const getUserProfile = async (req, res) => {
    const { _id } = req.user;

    try {
        const profile = await UserProfile.findOne({ userId: _id })
            .populate("userId", "firstName lastName username email");

        if (!profile) {
            return res.status(404).json({ message: "User profile not found" });
        }

        return res.status(200).json({
            user: formatUser(profile.userId),
            profile: formatProfile(profile),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const updateUserAndProfile = async (req, res) => {
    const { _id } = req.user;
    const { firstName, lastName, username, ...profileData } = req.body;

    try {
        let updatedUser = await User.findById(_id).select("firstName lastName username email");
        if (firstName || lastName || username) {
            updatedUser = await User.findByIdAndUpdate(
                _id,
                { $set: { firstName, lastName, username } },
                { new: true, runValidators: true }
            ).select("firstName lastName username email");
        }

        let updatedProfile = await UserProfile.findOneAndUpdate(
            { userId: _id },
            { $set: profileData },
            { new: true, runValidators: true, upsert: true }
        );

        return res.status(200).json({
            message: "User and profile updated successfully",
            user: formatUser(updatedUser),
            profile: formatProfile(updatedProfile),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getUserProfile, updateUserAndProfile };
