const express = require("express")
const {
    addCouponValidator,
    removeCouponValidator
    } = require("../utils/validator/couponValidator")


const {
    getCoupons,
    getCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
} = require("../services/couponService")

const authService = require("../services/authService")

const router = express.Router()

// to apply this for all routes
router.use(authService.protect, authService.allowedTo("admin", "manager"))

// get all categories || create new category
router.route("/")
.get(getCoupons)
.post(
    addCouponValidator,
    createCoupon
    )

// Get specific category by id
router.route("/:id")
.get(getCoupon)
.put(

    updateCoupon,
    )
.delete(
    removeCouponValidator,
    deleteCoupon
    )

module.exports = router