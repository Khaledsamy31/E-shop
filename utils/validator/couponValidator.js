const { check, param } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const userModel = require('../../models/userModel');
const couponModel = require('../../models/couponModel'); 
const { options } = require('../../routes/subCategoryRoute');

// Validate productId to ensure it's a valid MongoDB ObjectId and exists in the database
exports.addCouponValidator = [
    check('name')
        .notEmpty()
        .withMessage('coupon name is required')
        .toUpperCase()
        .custom(async (val, { req }) => {
            // التأكد من أن الاسم يتم تخزينه بحروف كبيرة
            const couponName = val.toUpperCase();
            // البحث عن الكوبون بناءً على الاسم
            const coupon = await couponModel.findOne({ name: couponName });
            if (coupon) {
                throw new Error('coupon is already existed');
            }
            
            return true;
        }),
            // التحقق من تاريخ الانتهاء
        check('expire')
        .notEmpty()
        .withMessage('Expiration date is required')
        .isDate({ format: 'MM/DD/YYYY' })
        .withMessage('Expiration date must be in MM/DD/YYYY format')
        .custom((value) => {
            const currentDate = new Date();
            const expireDate = new Date(value);
            if (expireDate < currentDate) {
                throw new Error('Expiration date must be in the future');
            }
            return true;
        }),
        // التحقق من نسبة الخصم
    check('discount')
    .notEmpty()
    .withMessage('Discount is required')
    .isInt({ min: 1, max: 100 })
    .withMessage('Discount must be a number between 1 and 100'),
    validatorMiddleware, // Middleware to catch validation errors
];

exports.updateCouponValidator = [
    check('name')
        .optional()
        .toUpperCase()
        .custom(async (val, { req }) => {
            // التأكد من أن الاسم يتم تخزينه بحروف كبيرة
            const couponName = val.toUpperCase();
            // البحث عن الكوبون بناءً على الاسم
            const coupon = await couponModel.findOne({ name: couponName });
            if (coupon) {
                throw new Error('coupon name is already existed');
            }
            
            return true;
        }),
            // التحقق من تاريخ الانتهاء
        check('expire')
        .optional()
        .isDate({ format: 'MM/DD/YYYY' })
        .withMessage('Expiration date must be in MM/DD/YYYY format')
        .custom((value) => {
            const currentDate = new Date();
            const expireDate = new Date(value);
            if (expireDate < currentDate) {
                throw new Error('Expiration date must be in the future');
            }
            return true;
        }),
        // التحقق من نسبة الخصم
    check('discount')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Discount must be a number between 1 and 100'),
    validatorMiddleware, // Middleware to catch validation errors
];


// Validate productId for delete to ensure it's a valid MongoDB ObjectId and exists in the wishlist
exports.removeCouponValidator = [
    check("id")
    .isMongoId().withMessage("Invalid product id format"),
    validatorMiddleware, // Middleware to catch validation errors
];
