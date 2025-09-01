const cloudinary = require('cloudinary').v2;
const fs = require("fs")

cloudinary.config({
    cloud_name: "dj5k49tz0",
    api_key: "126561231579592",
    api_secret: "v1Nyabvf3r4yKiVybQ1JRWoNk2Y",
    secure_distribution: 'http://localhost:5173/',
    // upload_prefix: 'https://api-eu.cloudinary.com'
});

const uploadOnCloudinary = async (filePath, userId) => {
    try {
        if (!filePath) {
            return;
        }
        const response = await cloudinary.uploader
            .upload(filePath, {
                resource_type: "image",
                folder: "profile_images",
                public_id: `user_${userId}_avatar`,
                overwrite: true,
            })
        fs.unlinkSync(filePath);
        return response;
    } catch (err) {
        console.error("Cloudinary upload error:", err);
        if (fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
        }
        return null;
    }
}

module.exports = uploadOnCloudinary;