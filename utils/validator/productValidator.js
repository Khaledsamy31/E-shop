const {check, body} = require("express-validator")
const validatorMiddleware = require("../../middlewares/validatorMiddleware")
const CategoryModel = require("../../models/categoryModel")
const subCategoryModel = require("../../models/subCategoryModel");
const { default: slugify } = require("slugify");

exports.createProductValidator = [
    check("title")
    .isLength({min: 2}).withMessage("must be atleast 2 chars")
    .notEmpty().withMessage("Product name is required")
    .custom((val, {req})=>{
        req.body.slug = slugify(val)
        return true;
    }),

    check("description")
    .notEmpty().withMessage("Product description is required")
    .isLength({min: 10}).withMessage("Too short product description")
    .isLength({max: 500}).withMessage("Too long description"),


    check("quantity")
    .notEmpty().withMessage("product quantity is required")
    .isNumeric().withMessage("Product quantity must be a number"),

    check("sold")
    .optional()
    .isNumeric().withMessage("product sold must be a number"),

    check("price")
    .notEmpty().withMessage("Product price is required")
    .isNumeric().withMessage("Product price must be a number")
    .isLength({max: 20}).withMessage("Too long price"),

    check("priceAfterDiscount")
    .optional()
    .isNumeric().withMessage("Product priceAfterDiscount must be a number")
    .toFloat() //value maybe contain a decimal point
    .custom((value, {req})=>{ // value is = value of priceAfterDiscount
        if(req.body.price <= value){
            throw new Error("priceAfterDiscount must be less than price")
        }
        return true
    }),

    check("colors")
    .optional()
    .isArray().withMessage("colors must be an array of string"),

    check("imageCover")
    .notEmpty().withMessage("Product image cover is required"),

    check("images")
    .optional()
    .isArray().withMessage("images must be an array of string"),


    check("category")
    .notEmpty().withMessage("product must be belong to a category")
    .isMongoId().withMessage("Invalid category id format")
    //custom cat to check when we add product in a cat by cat id.. check that cat id is already existed in db
    .custom((categoryId)=> CategoryModel.findById(categoryId).then((category)=>{
        if(!category){
            return Promise.reject(
                new Error(`no category for this id ${categoryId}`)
            )
        }
    })),


    check("subCategories")
    .optional()
    .isMongoId().withMessage("Invalid subCategory id format")
    //{_id: {$exists: true}} to return all subCategory that contain id
    //$in: subCategoriesIds to get all subCategories that we send in body.. to get them from $exists: true
    //$in: subCategoriesIds = get all subCategories of product we send in body
    .custom((subCategoriesIds)=> subCategoryModel.find({_id: {$exists: true, $in: subCategoriesIds}}).then(
        (result)=>{
            // check length of subCategory = length of subcategories in body
            //checl length of subcategories more than 1
            if(result.length <1 || result.length !== subCategoriesIds.length){
                return Promise.reject(
                    new Error(`Invatlid subCategories Ids`)
    )}
        })
    )

    .custom((val, {req})=> subCategoryModel.find({category: req.body.category}).then(
        (subCategories) =>{
            // to get all subCategories id's that belong to a category
            const subCategoriesIdsInDB = []
            subCategories.forEach((subCategory)=>{
                subCategoriesIdsInDB.push(subCategory._id.toString())
            });
            // subCategoriesIdsInDB is carry id's of subCat that belong to the cat in body
           // to check if subCat id's in body = subCategoriesIdsInDB?
           // if true = cat in body include subCat in body so subCat belong to cat
           // if false = cat in body not include subCat in body so subCat not belong to cat
           
           const checker = (target, arr)=>target.every((v => arr.includes(v)))
            //check if subcat id's in db  include subcats in req.body (true/false)
           if(!checker(val, subCategoriesIdsInDB)){
            return Promise.reject(
                new Error(`subCategories not belong to this category`)
            )
           }
           //the same code in another way
        //    if(!val.every(v => subCategoriesIdsInDB.includes(v))){
        //     return Promise.reject(
        //         new Error(`subCategories not belong to this category`)
        //     )
        //    }
        }
    )),


    check("brand")
    .optional()
    .isMongoId().withMessage("Invalid brand id format"),

    check("ratingsAverage")
    .optional()
    .isNumeric().withMessage("ratings average must be a number")
    .isLength({min:1}).withMessage("rating must be above or equal 1")
    .isLength({max:5}).withMessage("rating must be below or equal 5"),

    check("ratingsQuantity")
    .optional()
    .isNumeric().withMessage("ratings quantity must be a number"),

    validatorMiddleware, //validatorMiddleware catch any error and return it as response
];


exports.getProductValidator = [
    check("id")
    .isMongoId().withMessage("Invalid product id format"),
    
    validatorMiddleware,
];

exports.updateProductValidator = [
    check("id")
    .isMongoId().withMessage("Invalid product id format"),

    body("title").optional().custom((val, {req})=>{
        req.body.slug = slugify(val)
        return true;
    }),
    
    validatorMiddleware,
];

exports.deleteProductValidator = [
    check("id")
    .isMongoId().withMessage("Invalid product id format"),
    
    validatorMiddleware,
];