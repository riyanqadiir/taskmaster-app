const multer = require("multer");
const path = require("path");

const imageFileFilter = (req, file, cb) => {
    if (typeof file.mimetype === "string" && file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image uploads are allowed"));
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./public/temp"),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/\s+/g, "-");
        cb(null, `${base}-${Date.now()}${ext}`);
    }
});

const uploadImageOptional = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
}).single("image");

const optionalImageUpload = (req, res, next) => {
    uploadImageOptional(req, res, (err) => {
        if (!err) return next();
        if (err.name === "MulterError") {
            return res.status(400).json({ message: err.message });
        }
        return res.status(400).json({ message: err.message || "Invalid image upload" });
    });
};

module.exports = optionalImageUpload;
