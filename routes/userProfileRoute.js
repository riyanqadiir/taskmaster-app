const express = require("express");
const router = express.Router();

const {
    getUserProfile,
    updateUserProfile
} = require("../controller/userProfileController");

const validateUserProfile = require("../middleware/validateUserProfile");
const { verifyToken } = require("../middleware/authMiddleware");


router.get("/profile", verifyToken, getUserProfile);

router.patch("/profile", verifyToken, validateUserProfile, updateUserProfile);

module.exports = router;
