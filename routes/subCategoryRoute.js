const express = require("express")
const {createSubCategoryValidator,getSubCategoryValidator,updateSubCategoryValidator, deleteSubCategoryValidator} = require("../utils/validator/subCategoryValidator")

const {
    createSubCategory,
    getSubCategories,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory,
    setCategoryIdToBody,
    createFilterObject
} = require("../services/subCategoryServices")

const authService = require("../services/authService")

//mergeParams: true to allow category route to access subCategory that belong to it
// mergeParams: true // allow us to access paramters on other routers
// ex: we need to access  categoryId from category router
const router = express.Router({mergeParams: true})

router.route("/")
.post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
    )
.get(createFilterObject, getSubCategories)

router.route("/:id")
.get(getSubCategoryValidator, getSubCategory)
.put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    updateSubCategoryValidator, 
    updateSubCategory
    )
.delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteSubCategoryValidator, 
    deleteSubCategory
    )


module.exports = router;