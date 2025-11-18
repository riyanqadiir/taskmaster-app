const User = require("../model/User.js");
const UserProfile = require("../model/UserProfile.js");
const uploadOnCloudinary = require("../utility/cloudinary.js")
const formatUser = (u) => ({
    _id: u._id, firstName: u.firstName, lastName: u.lastName, username: u.username, email: u.email,
});

const formatProfile = (p) => ({
    address: p.address || "",
    phone: p.phone || "",
    bio: p.bio || "",
    avatarUrl: p.avatarUrl || "",
    interests: Array.isArray(p.interests) ? p.interests : [],
    socialLinks: p.socialLinks || {},
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
        if (req.file?.path) {
            const uploaded = await uploadOnCloudinary(req.file.path, _id);
            if (!uploaded) {
                return res.status(400).json({ message: "Avatar upload failed. Please try a different image." });
            }
            profileData.avatarUrl = uploaded.secure_url;
        }
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
