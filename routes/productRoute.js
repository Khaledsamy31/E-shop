const express = require("express")
const {
    createProductValidator,
    getProductValidator,
    updateProductValidator,
    deleteProductValidator} = require("../utils/validator/productValidator")


const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    resizeProductImages
} = require("../services/productService")

const reviewsRoute = require("./reviewRoute")

const authService = require("../services/authService")

const router = express.Router()

// Nested route
// POST Req /products/prodId/reviews = go to review route
// GET Req /products/prodId/reviews = go to review route
// GET Req /products/prodId/reviews/review = go to review route and get specific review on specific product
router.use("/:productId/reviews",reviewsRoute)


// get all products || create new product
router.route("/")
.get(getProducts)
.post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadProductImage,
    resizeProductImages,
    createProductValidator,
    createProduct
    )

// Get specific product by id
router.route("/:id")
.get(getProductValidator,getProduct)
.put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadProductImage, 
    resizeProductImages, 
    updateProductValidator, 
    updateProduct
    )
.delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteProductValidator, 
    deleteProduct
    )

module.exports = router