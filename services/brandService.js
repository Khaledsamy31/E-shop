const asyncHandler = require("express-async-handler")
const slugify = require("slugify")
const brandModel = require("../models/brandModel")
const ApiError = require("../utils/apiError")
const ApiFeatures = require("../utils/apiFeatures")
const factory = require("./handlersFactory")
const { v4: uuidv4 } = require('uuid'); // to generate unique id
const sharp = require('sharp');
const {uploadSingleImage} = require("../middlewares/uploadImageMiddleware")


//upload single image
exports.uploadBrandImage = uploadSingleImage("image")

// shap package to do resize to images and do some image processing
//image processing
exports.resizeImage = asyncHandler( async(req,res,next) =>{

    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`
    
   await sharp(req.file.buffer)
    .resize(600,600)
    .toFormat("jpeg")
    .jpeg({quality: 90}).toFile(`uploads/brands/${filename}`);

    req.body.image = filename; // to save image in db
    next();
});

// @desc     Create brand
// @route    POST  /api/v1/brand
// @access   Private

exports.createBrand = factory.createOne(brandModel)

// exports.createBrand = asyncHandler( async(req,res)=>{
//     const name = req.body.name;
//     const brands = await  brandModel.create({name,slug:slugify(name)})
//     //we didn't use try& catch cuz we use package asynchandler to catch errors
//     res.status(201).json({data:brands});
    
// })

// @desc     Get all Brands
// @route    GET  /api/v1/brands
// @access   Public

exports.getBrands = factory.getAll(brandModel)

// exports.getBrands = asyncHandler(async(req,res)=>{

//     // Build query
//     const documentsCounts = await brandModel.countDocuments() //countDocuments() return number of doc in db
//     const apiFeatures = new ApiFeatures(brandModel.find(), req.query)
//     .filter()
//     .search()
//     .sort()
//     .limitFields()
//     .paginate(documentsCounts);

//      //execute query
//      const {mongooseQuery, paginationResult} = apiFeatures;
//      const   brands = await mongooseQuery
//           res.status(200).json({results: brands.length, paginationResult, data: brands})
// })

// @ desc    Get specific brand by id
// @route    GET   /api/v1/brands/:id
// @access   Public

exports.getBrand = factory.getOne(brandModel)

// exports.getBrand = asyncHandler( async(req,res,next)=>{

//     const {id} = req.params;
//     const brands = await brandModel.findById(id);

//     if(!brands){
//         // res.status(404).json({msg: `No brand for this id ${id}`})
//        return next(new ApiError( `No brand for this id ${id}`, 404))
//     }
//         res.status(201).json({data: brands})
    
// })

// exports.applySlugify = (req,res,next)=>{
//     req.body.slug = slugify(req.body.name)
//     next()
// }

// @ desc    update specific brand by id
// @route    GET   /api/v1/brands/:id
// @access   Private

exports.updateBrands = factory.updateOne(brandModel)

// exports.updateBrands = asyncHandler(async(req,res, next)=>{
  
//     const {name} = req.body; //to update name
    
//     const brands = await brandModel.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         {new:true} // new = true, to show category in body after updated
//     )
    
//     if(!brands){
//         return next(new ApiError( `No brand for this id ${req.params.id}`, 404))
//     }
//     res.status(201).json({data: brands})
    
// })


// @ desc    Delete specific brand by id
// @route    DELETE   /api/v1/brands/:id
// @access   Private

exports.deleteBrands = factory.deleteOne(brandModel)

// exports.deleteBrands = asyncHandler(async(req,res, next)=>{
//     const {id} = req.params;
//     const brands = await brandModel.findByIdAndDelete(id)

//     if(!brands){
//         return next(new ApiError( `No brand for this id ${id}`, 404))
//     }
//         res.status(204).send()
// })

