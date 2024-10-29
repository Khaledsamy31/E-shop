const slugify = require("slugify")
const asyncHandler = require("express-async-handler")
const ApiError = require("../utils/apiError")
const SubCategoryModel = require("../models/subCategoryModel")
const ApiFeatures = require("../utils/apiFeatures")
const factory = require("./handlersFactory")

exports.setCategoryIdToBody = (req,res,next)=>{

        //Nested route (Create)
    //ex: if cat not fount in body try to get it from params by catId
    if(!req.body.category){
        req.body.category = req.params.categoryId
    }
next()
}

// @desc     Create subCategory
// @route    POST  /api/v1/subcategories
// @access   Private


exports.createSubCategory = factory.createOne(SubCategoryModel)


// exports.createSubCategory = asyncHandler( async(req,res)=>{

//     // const name = req.body.name;
//     // const category = req.body.category;

//     const {name,category} = req.body
//         const subCategory = await  SubCategoryModel.create({
//             name,
//             slug:slugify(name),
//             category,
//         })
//         //we didn't use try& catch cuz we use package asynchandler to catch errors
//         res.status(201).json({data:subCategory});

// })

//Nested route (Get)
//GET  /api/v1/categories/:categoryId/subCategories

exports.createFilterObject = (req, res, next)=>{
    let filterObject = {}
    if(req.params.categoryId) filterObject = {category: req.params.categoryId}
    
    req.filterObj = filterObject
    next();
};
// @desc     Get all subCategories
// @route    GET  /api/v1/subcategories
// @access   Public

exports.getSubCategories = factory.getAll(SubCategoryModel)
// exports.getSubCategories = asyncHandler(async(req,res)=>{

//    // Build query
//    const documentsCounts = await SubCategoryModel.countDocuments() //countDocuments() return number of doc in db
//    const apiFeatures = new ApiFeatures(
//     SubCategoryModel.find(req.filterObj), req.query)
//    .filter()
//    .search()
//    .sort()
//    .limitFields()
//    .paginate(documentsCounts);

//     //execute query
//     const {mongooseQuery, paginationResult} = apiFeatures;
//     const   subCategories = await mongooseQuery

//   // populate to return the name only of category that subcategory belong to it
// //   .populate({path: "category",select: "name -_id"})
//     res.status(200).json({results: subCategories.length, paginationResult, data: subCategories})

// })

// @ desc    Get specific subCategories by id
// @route    GET   /api/v1/subcategories/:id
// @access   Public

exports.getSubCategory = factory.getOne(SubCategoryModel)

// exports.getSubCategory = asyncHandler( async(req,res,next)=>{

//     const {id} = req.params;
//     const subCategory = await SubCategoryModel.findById(id)
//     // .populate({path: "category",select: "name -_id"}) 

//     if(!subCategory){
//         // res.status(404).json({msg: `No category for this id ${id}`})
//        return next(new ApiError( `No subCategory for this id ${id}`, 404))
//     }
//         res.status(201).json({data: subCategory})
    
// })

// @ desc    update specific subCategory by id
// @route    GET   /api/v1/subCategories/:id
// @access   Private

exports.updateSubCategory = factory.updateOne(SubCategoryModel)

// exports.updateSubCategory = asyncHandler(async(req,res, next)=>{
//     const {id} = req.params;
//     const {name, category} = req.body; //to update name
    
//     const subCategory = await SubCategoryModel.findOneAndUpdate(
//         {_id: id},
//         {name, slug: slugify(name), category},
//         {new:true} // new = true, to show category in body after updated
//     )
    
//     if(!subCategory){
//         return next(new ApiError( `No subCategory for this id ${id}`, 404))
//     }
//     res.status(201).json({data: subCategory})
    
// })


// @ desc    Delete specific subCategory by id
// @route    DELETE   /api/v1/subCategories/:id
// @access   Private

exports.deleteSubCategory = factory.deleteOne(SubCategoryModel)

// exports.deleteSubCategory = asyncHandler(async(req,res, next)=>{
//     const {id} = req.params;
//     const subCategory = await SubCategoryModel.findByIdAndDelete(id)

//     if(!subCategory){
//         return next(new ApiError( `No category for this id ${id}`, 404))
//     }
//         res.status(204).send()
// })