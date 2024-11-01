// this to check the rules on route before send it to controller || db
const { check,body } = require('express-validator');
//check to check error in body or param or query...
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { default: slugify } = require('slugify');



exports.createCategoryValidator = [
    check("name").notEmpty().withMessage("Category is required")
    .isLength({min:3}).withMessage("Too short category name")
    .isLength({max:30}).withMessage("Too long category name")
    .custom((val, {req})=>{
        req.body.slug = slugify(val)
        return true;
    }),
    validatorMiddleware
];

exports.getCategoryValidator = [
        // 1- rules we check and send errors to validatorMiddleware
        check("id").isMongoId().withMessage("Invalid category id format"), validatorMiddleware,
];

exports.updateCategoryValidator =[
    check("id").isMongoId().withMessage("Invalid category id format"),
    body("name").optional().custom((val, {req})=>{
        req.body.slug = slugify(val)
        return true;
    }),
    validatorMiddleware,

]

exports.deleteCategoryValidator =[
    check("id").isMongoId().withMessage("Invalid category id format"), validatorMiddleware,

]