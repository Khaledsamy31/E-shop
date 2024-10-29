const asyncHandler = require("express-async-handler")
const userModel = require("../models/userModel")

// @desc     Add address to user addresses list
// @route    POST  /api/v1/addresses
// @access   Private/user

exports.addAddress = asyncHandler(async(req,res,next)=>{
    const user = await userModel.findByIdAndUpdate(req.user._id,{
        // $addToSet to add value in array of mongo db
        // $addToSet to add address to addresses object in model if addressId not exist in the array
        $addToSet: {addresses: req.body}
    },{new: true})
   
    res.status(200).json({
        status: "Success",
        message: "Address added successfully to your addresses list",
        data: user.addresses})
})

// @desc     Remove address from user addresses list
// @route    DELETE  /api/v1/addresses/:addressId
// @access   Private/user
exports.removeAddressesFromAddressesList = asyncHandler(async(req,res,next)=>{
    const user = await userModel.findByIdAndUpdate(req.user._id,{
        // $pull to remove value in array of mongo db
        // $pull to remove address from address object if addressId exist in the obj
        $pull: {addresses: {_id: req.params.addressId}}
    },{new: true})
   
    res.status(200).json({
        status: "Success",
        message: "Address removed successfully from your addresses list",
        data: user.addresses})
})

// @desc     get logged user  addresses list
// @route    GET  /api/v1/addresses
// @access   Private/user

exports.getLoggedUserAddresses = asyncHandler(async(req,res,next)=>{
    const user = await userModel.findById(req.user._id).populate("addresses")
   
    res.status(200).json({
        status: "Success",
        results: user.addresses.length,
        data: user.addresses
        })
})