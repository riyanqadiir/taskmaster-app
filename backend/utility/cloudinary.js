const cloudinary = require('cloudinary').v2;
const fs = require("fs")

const cloudinary_credentials = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
}
cloudinary.config(cloudinary_credentials);


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