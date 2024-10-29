const express = require("express")
const {
    addProductToWishListValidator,
    removeProductFromWishListValidator
} = require("../utils/validator/wishlistValidation");


const {
addProductToWishList,
removeProductToWishList,
getLoggedUserWishList

} = require("../services/wishListService")

const authService = require("../services/authService")

const router = express.Router()

router.use(authService.protect, authService.allowedTo("user"))

router.route("/").post(addProductToWishListValidator, addProductToWishList)
.get(
 // get logged user  wishList
getLoggedUserWishList
)


router.route("/:productId").delete(removeProductFromWishListValidator, removeProductToWishList)

module.exports = router