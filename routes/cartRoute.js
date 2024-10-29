const express = require("express")
const {
    addProductToCartValidator,
    removeCartItemValidator,
    updateCartItemQuantityValidator,
    applyCouponValidator
    } = require("../utils/validator/cartValidation")


const {
    addProductToCart,
    getLoggedUserCart,
    removeCartItem,
    clearCart,
    updateCartItemQuantity,
    applyCoupon
} = require("../services/cartService")

const authService = require("../services/authService")

const router = express.Router()

// to apply this for all routes
router.use(authService.protect, authService.allowedTo("user"))

// get all categories || create new category
router.route("/")

.post(
    addProductToCartValidator,
    addProductToCart
    )
.get(getLoggedUserCart)

.delete(clearCart) // to delete all items from user cart

router.put("/applyCoupon", applyCouponValidator, applyCoupon)
// Get specific category by id
router.route("/:itemId")
.put(
    updateCartItemQuantityValidator,
    updateCartItemQuantity
    )

.delete(
    removeCartItemValidator,
    removeCartItem
    )

module.exports = router