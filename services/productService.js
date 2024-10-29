const asyncHandler = require("express-async-handler")
const slugify = require("slugify")
const multer = require("multer")
const ApiError = require("../utils/apiError")
const productModel = require("../models/productModel")
const CategoryModel = require("../models/categoryModel")
const ApiFeatures = require("../utils/apiFeatures")
const factory = require("./handlersFactory")
const { v4: uuidv4 } = require('uuid'); // to generate unique id
const sharp = require('sharp');
const {uploadSingleImage} = require("../middlewares/uploadImageMiddleware")

const {uploadMixOfImages} = require("../middlewares/uploadImageMiddleware")


    exports.uploadProductImage = uploadMixOfImages([
        {name: 'imageCover', maxCount: 1},
        {name: 'images', maxCount: 5}  //for multiple images upload
    ]);

    exports.resizeProductImages = asyncHandler( async(req, res , next) => {

        // 1- image processing for imageCover
        if(req.files.imageCover){
            const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`
    
            await sharp(req.files.imageCover[0].buffer)
             .resize(2000,1333)
             .toFormat("jpeg")
             .jpeg({quality: 90}).toFile(`uploads/products/${imageCoverFileName}`);
         
             req.body.imageCover = imageCoverFileName; // to save image in db
        }

         // 2- image processing for images
         if(req.files.images){
             req.body.images = []

             // Promise.all is used to wait for all promises to be resolved before moving to the next line
             // if any promise rejects, Promise.all will reject as well
             // we can use catch block to handle promise rejections
          await  Promise.all(
                req.files.images.map(async(img, index)=>{

                    const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`
        
                    await sharp(img.buffer)
                     .resize(500,333)
                     .toFormat("jpeg")
                     .jpeg({quality: 90}).toFile(`uploads/products/${imageName}`);
                 
                     req.body.images.push(imageName)  // to save images in db
                })
            )

           next()
         }
    })


//bussinces logic/controller


// @desc     Create Product
// @route    POST  /api/v1/categories
// @access   Private

exports.createProduct = factory.createOne(productModel)

// exports.createProduct = asyncHandler( async(req,res)=>{

//     //validate for category
//     // const  category = await CategoryModel.findById(req.body.category)
//     req.body.slug = slugify(req.body.title);
    
//     const product = await  productModel.create(req.body)
//     //we didn't use try& catch cuz we use package asynchandler to catch errors
//     res.status(201).json({data:product});
    
// })

// @desc     Get all products
// @route    GET  /api/v1/products
// @access   Public

exports.getProducts = factory.getAll(productModel, "productModel")
// exports.getProducts = asyncHandler(async(req,res)=>{


//     // Build query
//     const documentsCounts = await productModel.countDocuments() //countDocuments() return number of doc in db
//     const apiFeatures = new ApiFeatures(productModel.find(), req.query)
//     .filter()
//     .search("productModel")
//     .sort()
//     .limitFields()
//     .paginate(documentsCounts);

//      //execute query
//      const {mongooseQuery, paginationResult} = apiFeatures;
//      // populate to return the name only of category that product belong to it
//      // .populate({path: "category", select: "name -_id"})
//      const   products = await mongooseQuery.populate({path: "category", select: "name -_id"})
     
//           res.status(200).json({results: products.length, paginationResult, data: products})


// })

// @ desc    Get specific product by id
// @route    GET   /api/v1/product/:id
// @access   Public

exports.getProduct = factory.getOne(productModel, "reviews")

// exports.getProduct = asyncHandler( async(req,res,next)=>{

//     const {id} = req.params;
//     const product = await productModel.findById(id).populate({path: "category", select: "name -_id"});

//     if(!product){
//         // res.status(404).json({msg: `No product for this id ${id}`})
//        return next(new ApiError( `No product for this id ${id}`, 404))
//     }
//         res.status(201).json({data: product})
    
// })

// @ desc    update specific product by id
// @route    GET   /api/v1/product/:id
// @access   Private

exports.updateProduct = factory.updateOne(productModel)

// exports.updateProduct = asyncHandler(async(req,res, next)=>{
//     const {id} = req.params;
//     if(req.body.title){
//         // if title is provided in body, we update it
//         req.body.slug = slugify(req.body.title);
//     }
    
//     const product = await productModel.findOneAndUpdate(
//         {_id: id},
//         req.body, // to send all objs in body
//         {new:true} // new = true, to show category in body after updated
//     )
    
//     if(!product){
//         return next(new ApiError(`No product for this id ${id}`, 404))
//     }
//     res.status(201).json({data: product})
    
// })


// @ desc    Delete specific product by id
// @route    DELETE   /api/v1/product/:id
// @access   Private

exports.deleteProduct = factory.deleteOne(productModel)

// exports.deleteProduct = asyncHandler(async(req,res, next)=>{
//     const {id} = req.params;
//     const product = await productModel.findByIdAndDelete(id)

//     if(!product){
//         return next(new ApiError( `No product for this id ${id}`, 404))
//     }
//         res.status(204).send()
// })