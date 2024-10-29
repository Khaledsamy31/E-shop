const { check, param } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const userModel = require('../../models/userModel');
const productModel = require('../../models/productModel'); 

exports.addAddressValidator = [
    // Validate alias and check if it's unique for the user
    check('alias')
        .notEmpty()
        .withMessage('Alias is required')
        .custom(async (alias, { req }) => {
            const user = await userModel.findById(req.user._id);
            const aliasExists = user.addresses.some(address => address.alias === alias);
            if (aliasExists) {
                throw new Error('Alias already exists in your addresses');
            }
        }),

    // Validate details
    check('details')
        .notEmpty()
        .withMessage('Details are required')
        .isLength({ min: 5 })
        .withMessage('Details must be at least 5 characters long'),

    // Validate phone
    check('phone')
        .notEmpty()
        .withMessage('Phone number is required')
        .isMobilePhone('ar-EG') // This checks for Egyptian phone number format
        .withMessage('Invalid phone number format'),

    // Validate city
    check('city')
        .notEmpty()
        .withMessage('City is required'),

    // Validate postal code
    check('postalCode')
        .optional(),
    // Use the validator middleware to handle errors
    validatorMiddleware,
];

// Validate address removal
exports.removeAddressValidator = [
    check('addressId')
        .isMongoId()
        .withMessage('Invalid address ID format')
        .custom(async (addressId, { req }) => {
            // احصل على المستخدم الحالي
            const user = await userModel.findById(req.user._id);

            // تحقق مما إذا كان العنوان موجودًا في قائمة العناوين
            const addressExists = user.addresses.some(address => address._id.toString() === addressId);
            if (!addressExists) {
                throw new Error('Address not found in your addresses list');
            }
        }),
    validatorMiddleware,
];
