const { check, param } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const userModel = require('../../models/userModel');
const productModel = require('../../models/productModel'); 

// Validate productId to ensure it's a valid MongoDB ObjectId and exists in the database
exports.addProductToWishListValidator = [
    check('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid Product ID format')
        .custom(async (productId, { req }) => {
            const product = await productModel.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

             // Check if the product is already in the user's wishlist
             const user = await userModel.findById(req.user._id);
             if (user.wishlist.includes(productId)) {
                 throw new Error('Product already exists in your wishlist');
             }

            return true;
        }),
    validatorMiddleware, // Middleware to catch validation errors
];

// Validate productId for delete to ensure it's a valid MongoDB ObjectId and exists in the wishlist
exports.removeProductFromWishListValidator = [
    check('productId')
        .isMongoId()
        .withMessage('Invalid Product ID format')
        .custom(async (productId, { req }) => {
            // Check if the product exists in the database
            const product = await productModel.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            // Check if the product is in the user's wishlist
            const user = await userModel.findById(req.user._id);
            if (!user.wishlist.includes(productId)) {
                throw new Error('Product not found in your wishlist');
            }

            return true;
        }),
    validatorMiddleware, // Middleware to catch validation errors
];
