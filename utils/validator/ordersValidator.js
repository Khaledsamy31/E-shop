const { check, param } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const userModel = require('../../models/userModel');
const couponModel = require('../../models/couponModel'); 
const { options } = require('../../routes/subCategoryRoute');

exports.createOrderValidator = [
    // التحقق من وجود كائن shippingAddress
    check('shippingAddress')
        .isObject()
        .withMessage('Shipping address is required and should be an object'),

    // التحقق من حقل details
    check('shippingAddress.details')
        .notEmpty()
        .withMessage('Details are required')
        .isString()
        .withMessage('Details must be a string')
        .isLength({ min: 5, max: 100 })
        .withMessage('Details should be between 5 and 100 characters'),

    // التحقق من حقل phone
    check('shippingAddress.phone')
        .isString()
        .withMessage('phone must be a string')
        .notEmpty()
        .withMessage('Phone number is required')
        .isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage("Invalid phone number, only accept EGY & SA numbers"),


    // التحقق من حقل city
    check('shippingAddress.city')
        .isString()
        .withMessage('City must be a string')
        .notEmpty()
        .withMessage('City is required'),

    // التحقق من حقل postalCode
    check('shippingAddress.postalCode')
        .isString()
        .withMessage('City must be a string')
        .optional(),

    // ميدلوير لمعالجة أخطاء التحقق
    validatorMiddleware,
];