const express = require("express")
const {
    addAddressValidator,
    removeAddressValidator
} = require("../utils/validator/addressValidator");


const {
addAddress,
removeAddressesFromAddressesList,
getLoggedUserAddresses

} = require("../services/addressService")

const authService = require("../services/authService")

const router = express.Router()

router.use(authService.protect, authService.allowedTo("user"))

router.route("/").post(addAddressValidator, addAddress)
.get(
 // get logged user  addresses
 getLoggedUserAddresses
)


router.route("/:addressId").delete(removeAddressValidator, removeAddressesFromAddressesList)

module.exports = router