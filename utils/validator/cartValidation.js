const { check } = require('express-validator');
const productModel = require('../../models/productModel');
const cartModel = require('../../models/cartModel');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.addProductToCartValidator = [
    // التحقق من أن productId ليس فارغًا وأنه يمثل ObjectId صالح
    check('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid Product ID format')
        .custom(async (value) => {
            const product = await productModel.findById(value);
            if (!product) {
                throw new Error('Product not found');
            }
            return true;
        }),

    // التحقق من color
    check('color')
        .optional()
        .isString()
        .withMessage('Color must be a valid string'),

    // التحقق من ملكية المستخدم للعربة
    check('user')
        .custom(async (value, { req }) => {
            const cart = await cartModel.findOne({ user: req.user._id });
            if (cart && cart.user.toString() !== req.user._id.toString()) {
                throw new Error('Not authorized to access this cart');
            }
            return true;
        }),

    validatorMiddleware, // Middleware to catch validation errors
];


exports.removeCartItemValidator = [
    // التحقق من أن itemId هو MongoDB ObjectId صالح
    check('itemId')
        .isMongoId()
        .withMessage('Invalid item ID format'),

    // التحقق من أن المستخدم يملك العنصر المراد حذفه
    check('user')
        .custom(async (value, { req }) => {

            const cart = await cartModel.findOne({ user: req.user._id });
            if (!cart) {
                throw new Error(`No cart found for user id ${req.user._id}`);
            }
            const itemExists = cart.cartItems.some(item => item._id.toString() === req.params.itemId);
            if (!itemExists) {
                throw new Error('Item not found in cart');
            }
            return true;
        }),

    validatorMiddleware, // Middleware to catch validation errors
];

exports.updateCartItemQuantityValidator = [

    check('itemId')
    .isMongoId()
    .withMessage('Invalid item ID format'),

        // التحقق من ملكية المستخدم للعربة
        check('user')
        .custom(async (value, { req }) => {
            const cart = await cartModel.findOne({ user: req.user._id });
            if (cart && cart.user.toString() !== req.user._id.toString()) {
                throw new Error('Not authorized to access this cart');
            }
            return true;
        }),
        validatorMiddleware
]


exports.applyCouponValidator = [

    check('coupon')
    .notEmpty()
    .withMessage('coupon is required'),

        // التحقق من ملكية المستخدم للعربة
        check('user')
        .custom(async (value, { req }) => {
            const cart = await cartModel.findOne({ user: req.user._id });
            if (cart && cart.user.toString() !== req.user._id.toString()) {
                throw new Error('Not authorized to access this cart');
            }
            return true;
        }),
        validatorMiddleware
]