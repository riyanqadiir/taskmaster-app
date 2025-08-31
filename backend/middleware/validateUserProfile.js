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
    body("address")
        .optional({ checkFalsy: true })
        .isString().withMessage("Address must be a string")
        .trim(),

    body("phone")
        .optional({ checkFalsy: true })
        .matches(/^[\d\s()+-]{7,}$/)
        .withMessage("Phone number must contain only digits, spaces, and symbols (+, -, (, ))"),

    body("bio")
        .optional({ checkFalsy: true })
        .isString().withMessage("Bio must be a string")
        .trim(),

    body("interests")
        .optional({ checkFalsy: true })
        .isArray().withMessage("Interests must be an array of strings")
        .custom((value) => {
            if (!value.every(item => typeof item === 'string')) {
                throw new Error("All interests must be strings");
            }
            return true;
        }),

    body("socialLinks")
        .optional({ checkFalsy: true })
        .isObject().withMessage("Social links must be an object"),

    body("socialLinks.facebook")
        .optional({ checkFalsy: true })
        .isURL().withMessage("Facebook link must be a valid URL"),

    body("socialLinks.twitter")
        .optional({ checkFalsy: true })
        .isURL().withMessage("Twitter link must be a valid URL"),

    body("socialLinks.linkedin")
        .optional({ checkFalsy: true })
        .isURL().withMessage("LinkedIn link must be a valid URL"),

    body("socialLinks.github")
        .optional({ checkFalsy: true })
        .isURL().withMessage("GitHub link must be a valid URL"),

    body("socialLinks.website")
        .optional({ checkFalsy: true })
        .isURL().withMessage("Website must be a valid URL"),

    handleValidationErrors
];

module.exports = validateUserProfile;
