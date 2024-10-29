const multer = require("multer")
const slugify = require("slugify")
const asyncHandler = require("express-async-handler")
const CategoryModel = require("../models/categoryModel")
const ApiError = require("../utils/apiError")
const ApiFeatures = require("../utils/apiFeatures")
const factory = require("./handlersFactory")
const { v4: uuidv4 } = require('uuid'); // to generate unique id
const sharp = require('sharp');
const {uploadSingleImage} = require("../middlewares/uploadImageMiddleware")


//upload single image
exports.uploadCategoryImage = uploadSingleImage("image")

// shap package to do resize to images and do some image processing
//image processing
exports.resizeImage = asyncHandler( async(req,res,next) =>{

    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`
    // if there is img do this req.file = if there is img
    if(req.file){
        await sharp(req.file.buffer)
        .resize(600,600)
        .toFormat("jpeg")
        .jpeg({quality: 90}).toFile(`uploads/categories/${filename}`);

        req.body.image = filename; // to save image in db
    }
    next();
});


// @desc     Create Category
// @route    POST  /api/v1/categories
// @access   Private/ admin-manager



exports.createCategory = factory.createOne(CategoryModel)

// exports.createCategory = asyncHandler( async(req,res)=>{
    
//     const name = req.body.name;
    
//     const category = await  CategoryModel.create({name,slug:slugify(name)})
//     //we didn't use try& catch cuz we use package asynchandler to catch errors
//     res.status(201).json({data:category});
    
// })

// @desc     Get all categories
// @route    GET  /api/v1/categories
// @access   Public

exports.getCategories = factory.getAll(CategoryModel)

// exports.getCategories = asyncHandler(async(req,res)=>{

//    // Build query
//    const documentsCounts = await CategoryModel.countDocuments() //countDocuments() return number of doc in db
//    const apiFeatures = new ApiFeatures(CategoryModel.find(), req.query)
//    .filter()
//    .search()
//    .sort()
//    .limitFields()
//    .paginate(documentsCounts);

//     //execute query
//     const {mongooseQuery, paginationResult} = apiFeatures;
//     const   categories = await mongooseQuery

//     res.status(200).json({results: categories.length, paginationResult, data: categories})

// })

// @ desc    Get specific category by id
// @route    GET   /api/v1/categories/:id
// @access   Public

exports.getCategory = factory.getOne(CategoryModel)


// exports.getCategory = asyncHandler( async(req,res,next)=>{

//     const {id} = req.params;
//     const category = await CategoryModel.findById(id);

//     if(!category){
//         // res.status(404).json({msg: `No category for this id ${id}`})
//        return next(new ApiError( `No category for this id ${id}`, 404))
//     }
//         res.status(201).json({data: category})
    
// })

// @ desc    update specific category by id
// @route    GET   /api/v1/categories/:id
// @access   Private/admin-manager

exports.updateCategory = factory.updateOne(CategoryModel)

// exports.updateCategory = asyncHandler(async(req,res, next)=>{
//     const {id} = req.params;
//     const {name} = req.body; //to update name
    
//     const category = await CategoryModel.findOneAndUpdate(
//         {_id: id},
//         {name, slug: slugify(name)},
//         {new:true} // new = true, to show category in body after updated
//     )
    
//     if(!category){
//         return next(new ApiError( `No category for this id ${id}`, 404))
//     }
//     res.status(201).json({data: category})
    
// })


// @ desc    Delete specific category by id
// @route    DELETE   /api/v1/categories/:id
// @access   Private/admin-manager

exports.deleteCategory = factory.deleteOne(CategoryModel)

// exports.deleteCategory = asyncHandler(async(req,res, next)=>{
//     const {id} = req.params;
//     const category = await CategoryModel.findByIdAndDelete(id)

//     if(!category){
//         return next(new ApiError( `No category for this id ${id}`, 404))
//     }
//         res.status(204).send()
// })