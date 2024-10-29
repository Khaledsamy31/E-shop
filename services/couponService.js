const asyncHandler = require("express-async-handler")
const slugify = require("slugify")
const couponModel = require("../models/couponModel")
const ApiError = require("../utils/apiError")
const ApiFeatures = require("../utils/apiFeatures")
const factory = require("./handlersFactory")



// @desc     Create coupon
// @route    POST  /api/v1/coupons
// @access   Private

exports.createCoupon = factory.createOne(couponModel)


// @desc     Get all coupons
// @route    GET  /api/v1/coupons
// @access   Private/admin-manager

exports.getCoupons = factory.getAll(couponModel)

// @ desc    Get specific coupons by id
// @route    GET   /api/v1/coupons/:id
// @access   Private/admin-manager

exports.getCoupon = factory.getOne(couponModel)


// @ desc    update specific coupon by id
// @route    GET   /api/v1/coupons/:id
// @access   Private/admin-manager

exports.updateCoupon = factory.updateOne(couponModel)


// @ desc    Delete specific coupon by id
// @route    DELETE   /api/v1/coupons/:id
// @access   Private/admin-manager

exports.deleteCoupon = factory.deleteOne(couponModel)
