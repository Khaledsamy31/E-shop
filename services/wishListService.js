const asyncHandler = require("express-async-handler")
const ApiError = require("../utils/apiError")
const userModel = require("../models/userModel")

// @desc     Add product to wishList
// @route    POST  /api/v1/wishlist
// @access   Private/user

exports.addProductToWishList = asyncHandler(async(req,res,next)=>{
    const user = await userModel.findByIdAndUpdate(req.user._id,{
        // $addToSet to add value in array of mongo db
        // $addToSet to add productId to wishlist array if productId not exist in the array
        $addToSet: {wishlist: req.body.productId}
    },{new: true})
   
    res.status(200).json({
        status: "Success",
        message: "Product added successfully to your wishlist",
        data: user.wishlist})
})

// @desc     Remove product from wishList
// @route    DELETE  /api/v1/wishlist/:productId
// @access   Private/user
exports.removeProductToWishList = asyncHandler(async(req,res,next)=>{
    const user = await userModel.findByIdAndUpdate(req.user._id,{
        // $pull to remove value in array of mongo db
        // $pull to remove productId to wishlist array if productId exist in the array
        $pull: {wishlist: req.params.productId}
    },{new: true})
   
    res.status(200).json({
        status: "Success",
        message: "Product removed successfully from your wishlist",
        data: user.wishlist})
})

// @desc     get logged user  wishList
// @route    GET  /api/v1/wishlist
// @access   Private/user

exports.getLoggedUserWishList = asyncHandler(async(req,res,next)=>{
    const user = await userModel.findById(req.user._id).populate("wishlist")
   
    res.status(200).json({
        status: "Success",
        results: user.wishlist.length,
        data: user.wishlist
        })
})