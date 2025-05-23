const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = {};
        errors.array().forEach(err => {
            formattedErrors[err.path] = err.msg;
        });
        return res.status(400).json({ errors: formattedErrors });
    }
    next();
};

const validateUserProfile = [
    body("userId")
        .isMongoId().withMessage("Invalid user ID"),

    body("address")
        .optional()
        .isString().withMessage("Address must be a string")
        .trim(),

    body("phone")
        .optional()
        .matches(/^[\d\s()+-]{7,}$/)
        .withMessage("Phone number must contain only digits, spaces, and symbols (+, -, (, ))"),

    body("bio")
        .optional()
        .isString().withMessage("Bio must be a string")
        .trim(),

    body("interests")
        .optional()
        .isArray().withMessage("Interests must be an array of strings")
        .custom((value) => {
            if (!value.every(item => typeof item === 'string')) {
                throw new Error("All interests must be strings");
            }
            return true;
        }),

    body("socialLinks")
        .optional()
        .isObject().withMessage("Social links must be an object"),

    body("socialLinks.facebook")
        .optional()
        .isURL().withMessage("Facebook link must be a valid URL"),

    body("socialLinks.twitter")
        .optional()
        .isURL().withMessage("Twitter link must be a valid URL"),

    body("socialLinks.linkedin")
        .optional()
        .isURL().withMessage("LinkedIn link must be a valid URL"),

    body("socialLinks.github")
        .optional()
        .isURL().withMessage("GitHub link must be a valid URL"),

    body("socialLinks.website")
        .optional()
        .isURL().withMessage("Website must be a valid URL"),

    handleValidationErrors
];

module.exports = validateUserProfile;
