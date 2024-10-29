const asyncHandler = require("express-async-handler")
const slugify = require("slugify")
const ApiError = require("../utils/apiError")
const ApiFeatures = require("../utils/apiFeatures")
const factory = require("./handlersFactory")
const reviewModel = require("../models/reviewModel")


//Nested route (Get)
//GET  /api/v1/products/:productId/reviews

exports.createFilterObject = (req, res, next)=>{
    let filterObject = {}
    if(req.params.productId) filterObject = {product: req.params.productId}
    
    req.filterObj = filterObject
    next();
};
// @desc     Create reviews
// @route    POST  /api/v1/reviews
// @access   Private/protect/user

exports.createReview = factory.createOne(reviewModel)


exports.setProductIdAndUserToBody = (req,res,next)=>{

    //Nested route (Create)
//ex: if product not fount in body try to get it from params by productId
if(!req.body.product){
    req.body.product = req.params.productId
}
if(!req.body.user){
    req.body.user = req.user._id
}
next()
}

// @desc     Get all reviews
// @route    GET  /api/v1/reviews
// @access   Public

exports.getReviews = factory.getAll(reviewModel)


// @ desc    Get specific brand by id
// @route    GET   /api/v1/brands/:id
// @access   Public

exports.getReview = factory.getOne(reviewModel)


// @ desc    update specific review by id
// @route    GET   /api/v1/reviews/:id
// @access   Private

exports.updateReview = factory.updateOne(reviewModel)


// @ desc    Delete specific review by id
// @route    DELETE   /api/v1/reviews/:id
// @access   Private/protect/user-admin-manager

exports.deleteReview = factory.deleteOne(reviewModel)



