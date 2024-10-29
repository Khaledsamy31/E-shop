const express = require("express")
const {
    getBrandValidator,
     createBrandValidator,
      updateBrandValidator,
       deleteBrandValidator
    } = require("../utils/validator/brandValidator")


const {
    getBrands,
    getBrand,
    createBrand,
    updateBrands,
    deleteBrands,
    uploadBrandImage,
    resizeImage
} = require("../services/brandService")

const authService = require("../services/authService")

const router = express.Router()


// get all categories || create new category
router.route("/")
.get(getBrands)
.post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage, 
    createBrandValidator,
    createBrand
    )

// Get specific category by id
router.route("/:id")
.get(getBrandValidator,getBrand)
.put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrands,
    )
.delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteBrandValidator,
    deleteBrands
    )

module.exports = router