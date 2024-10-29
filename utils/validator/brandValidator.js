// this to check the rules on route before send it to controller || db
const { check,body } = require('express-validator');
//check to check error in body or param or query...
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { default: slugify } = require('slugify');



exports.createBrandValidator = [
    check("name").notEmpty().withMessage("Brand is required")
    .isLength({min:3}).withMessage("Too short Brand name")
    .isLength({max:30}).withMessage("Too long Brand name")
    .custom((val, {req})=>{
        req.body.slug = slugify(val)
        return true;
    }),
    validatorMiddleware
];

exports.getBrandValidator = [
        // 1- rules we check and send errors to validatorMiddleware
        check("id").isMongoId().withMessage("Invalid Brand id format"), validatorMiddleware,
];

exports.updateBrandValidator =[
    check("id").isMongoId().withMessage("Invalid Brand id format"),
    body("name").optional().custom((val, {req})=>{
        req.body.slug = slugify(val)
        return true;
    }),
    validatorMiddleware,

]

exports.deleteBrandValidator =[
    check("id").isMongoId().withMessage("Invalid Brand id format"), validatorMiddleware,

]