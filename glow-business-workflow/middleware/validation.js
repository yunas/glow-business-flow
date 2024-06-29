const { check, validationResult } = require('express-validator');

const validateBusiness = [
    check('fein').isLength({ min: 9, max: 9 }).withMessage('FEIN must be 9 digits.'),
    check('name').not().isEmpty().withMessage('Name is required.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateBusiness };
