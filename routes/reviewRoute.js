const express = require("express")
const {
    createReviewValidator,
    updateReviewValidator,
    getReviewValidator,
    deleteReviewValidator
    } = require("../utils/validator/reviewValidator")


const {
    getReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview,
    createFilterObject,
    setProductIdAndUserToBody
} = require("../services/reviewService")

const authService = require("../services/authService")

const router = express.Router({mergeParams: true})


// get all categories || create new category
router.route("/")
.get(createFilterObject,getReviews)
.post(
    authService.protect,
    authService.allowedTo("user"),
    setProductIdAndUserToBody,
    createReviewValidator,
    createReview
    )

// Get specific category by id
router.route("/:id")
.get(getReviewValidator, getReview)
.put(
    authService.protect,
    authService.allowedTo("user"),
    updateReviewValidator,
    updateReview,
    )
.delete(
    authService.protect,
    authService.allowedTo("admin", "user", "manager"),
    deleteReviewValidator,
    deleteReview
    )

module.exports = router