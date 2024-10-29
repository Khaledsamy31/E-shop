// this to check the rules on route before send it to controller || db
const { check,body } = require('express-validator');
//check to check error in body or param or query...
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const reviewModel = require('../../models/reviewModel');




exports.createReviewValidator = [
    check("title")
    .notEmpty()
    .withMessage('Review required'),

    check("ratings")
    .notEmpty().withMessage("ratings value required")
    .isFloat({min:1, max:5}).withMessage("ratings value must be between 1 to 5"),

    check("user").isMongoId().withMessage("Invalid user id format"),
    check("product").isMongoId().withMessage("Invalid product id format")
    .custom((val,{req})=>
        
        // check if logged user create an review on this product before
        // if true, return msg "you already reviewed tihs product"
        reviewModel.findOne({user: req.user._id, product: req.body.product}).then((review)=>{
            if(review){
               return Promise.reject(new Error("You have already reviewed this product"));
            }
        })
    )

    ,
    validatorMiddleware
];

exports.getReviewValidator = [
        // 1- rules we check and send errors to validatorMiddleware
        check("id").isMongoId().withMessage("Invalid Review id format"), validatorMiddleware,
];

exports.updateReviewValidator =[
  check("title").optional(),
    check("id").isMongoId().withMessage("Invalid Review id format")
    .custom((val, {req})=>

        // check if this user the owner of the review before update it
        reviewModel.findById(val).then((review)=>{
            if(!review){
                return Promise.reject(new Error(`There is no review with id ${val}`));
            }
            // if id of user that created this review not = id of user that try to update it return this msg
            if(review.user._id.toString()!== req.user._id.toString()){
                return Promise.reject(new Error("You are not authorized to update this review"));
            }
        })
    ),
    validatorMiddleware,

]

exports.deleteReviewValidator =[
    // user & admin & manager have permession to delete a review but user can delete only his review
    check("id").isMongoId().withMessage("Invalid Review id format")
    .custom((val, {req})=>{
        
        // check if this user the owner of the review before delete it, if it the owner... allow to delete it
       if(req.user.role === "user"){
      return  reviewModel.findById(val).then((review)=>{

            if(!review){
                return Promise.reject(new Error(`There is no review with id ${val}`));
            }
          
            // if id of user that created this review not = id of user that try to update it return this msg
            if(review.user._id.toString()!== req.user._id.toString()){
                return Promise.reject(new Error("You are not authorized to delete this review"));
            }
        })
       }
    
       return true

    }),
     validatorMiddleware,

]