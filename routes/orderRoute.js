const express = require("express")

const {
    createOrderValidator
    } = require("../utils/validator/ordersValidator")


const {
    createCashOrder,
    getAllOrders,
    filterOrderForLoggedUser,
    getSpecificOrder,
    updateOrderToPaid,
    updateOrderToDelivered,
    checkOutSession
} = require("../services/orderService")

const authService = require("../services/authService")

const router = express.Router()

router.use(authService.protect)

router.get("/checkout-session/:cartId", authService.allowedTo("user"), checkOutSession)

// get user order || create new order
router.route("/:cartId")
.post(
    authService.allowedTo("user"),
    createOrderValidator,
    createCashOrder
    )

router.get("/",
    authService.allowedTo("user", "manager", "admin"),
    filterOrderForLoggedUser,
    getAllOrders
        )

router.get("/:id",
    authService.allowedTo("user", "manager", "admin"),
     getSpecificOrder
    )

    // to change order status to paid || delivered
router.put("/:id/pay",
    authService.allowedTo("manager", "admin"),
    updateOrderToPaid,
    )
    
router.put("/:id/deliver",
    authService.allowedTo("manager", "admin"),
    updateOrderToDelivered,
    )

module.exports = router