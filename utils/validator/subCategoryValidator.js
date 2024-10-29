// this to check the rules on route before send it to controller || db
const { check,body } = require('express-validator');
//check to check error in body or param or query...
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { default: slugify } = require('slugify');


exports.getSubCategoryValidator = [
        // 1- rules we check and send errors to validatorMiddleware
        check("id")
        .isMongoId().withMessage("Invalid SubCategory id format"),
        
        validatorMiddleware,
];

exports.createSubCategoryValidator = [
    check("name")
    .notEmpty().withMessage("SubCategory is required")
    .isLength({min:2}).withMessage("Too short SubCategory name")
    .isLength({max:30}).withMessage("Too long SubCategory name")
    .custom((val, {req})=>{
        req.body.slug = slugify(val)
        return true;
    }),
    
    check("category")
    .notEmpty().withMessage("subCategory must be belong to category")
    .isMongoId().withMessage("Invalid category id format"),

    body("name").custom((val, {req})=>{
        req.body.slug = slugify(val)
        return true;
    }),
    validatorMiddleware
];

exports.updateSubCategoryValidator =[
    check("id")
    .notEmpty().withMessage("id is required to update subCategory")
    .isMongoId().withMessage("Invalid SubCategory id format"),
    
    check("name")
    .notEmpty().withMessage("SubCategory is required")
    .isLength({min:2}).withMessage("Too short SubCategory name")
    .isLength({max:30}).withMessage("Too long SubCategory name"),

    body("name").custom((val, {req})=>{
        req.body.slug = slugify(val)
        return true;
    }),

    validatorMiddleware,

]

exports.deleteSubCategoryValidator =[
    check("id")

    .isMongoId().withMessage("Invalid SubCategory id format"), validatorMiddleware,

]