const express = require("express")
const {getCategoryValidator, createCategoryValidator, updateCategoryValidator, deleteCategoryValidator} = require("../utils/validator/categoryValidator")
const multer  = require('multer')


const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    uploadCategoryImage,
    resizeImage
} = require("../services/categoryService")

const authService = require("../services/authService")

// Nested route
// GET  /api/v1/categories/:categoryId/subCategories
const subCategoriesRoute = require("./subCategoryRoute")

const router = express.Router()

//routes
// Nested Route
router.use("/:categoryId/subcategories",subCategoriesRoute)

// get all categories || create new category
router.route("/")
.get(getCategories)
.post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
    )

// Get specific category by id
router.route("/:id")
.get(getCategoryValidator,getCategory)
.put(authService.protect, authService.allowedTo("admin","manager") ,uploadCategoryImage, resizeImage,updateCategoryValidator, updateCategory)
.delete(authService.protect, authService.allowedTo("admin"), deleteCategoryValidator, deleteCategory)

module.exports = router