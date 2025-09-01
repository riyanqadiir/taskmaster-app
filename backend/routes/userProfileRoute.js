const express = require("express");
const router = express.Router();

const {
    getUserProfile,
    updateUserAndProfile,
} = require("../controller/userProfileController");
const diskUpload = require("../middleware/multer")
const validateUserProfile = require("../middleware/validateUserProfile");
const { verifyToken } = require("../middleware/authMiddleware");


router.get("/profile", verifyToken, getUserProfile);

router.patch("/profile", verifyToken, diskUpload, validateUserProfile, updateUserAndProfile);

module.exports = router;
