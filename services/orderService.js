const asyncHandler = require("express-async-handler")
const stripe = require("stripe")(process.env.STRIPE_SECRET)
const orderModel = require("../models/orderModel")
const ApiError = require("../utils/apiError")
const ApiFeatures = require("../utils/apiFeatures")
const factory = require("./handlersFactory")
const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")



// @desc     Create cash Order
// @route    POST  /api/v1/orders/cartId
// @access   Private/user

exports.createCashOrder = asyncHandler(async (req, res, next)=>{
    // app setting
    const taxPrice = 0;
    const shippingPrice = 0;

    // 1- Get cart by cart id
    const cart = await cartModel.findById(req.params.cartId)
    if(!cart){
        return next(new ApiError(`No cart found with id ${req.params.cartId}`, 404))
    }

    // 2- Get order price depend on cart price "check if coupon apply"
    // cartPrice = total price after discount if there is discount, if no discount = total price
    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice

    const totalOrderPrice = cartPrice + taxPrice + shippingPrice

    // 3- Create order with default paymentMethodType (cash)
    const order = await orderModel.create({
        user: req.user._id, // to send logged user id
        cartItems: cart.cartItems,
        totalOrderPrice, // cuz it same name here and in schema
        shippingAddress: req.body.shippingAddress,
    })

    // 4- After creating order, decrement product quantity , increment product sold in schema
    // bulkWrite to send more than 1 operation in one command like post,get,put,delete in one command
    if(order){

        const bulkOption = cart.cartItems.map((item) => ({
            updateOne:{
                filter: {_id: item.product},
                update: { $inc: {quantity: -item.quantity, sold: + item.quantity}}
            }
        }))
        await productModel.bulkWrite(bulkOption, {})

        // 5- clear user cart depend on cartId
        await cartModel.findByIdAndDelete(req.params.cartId)
    }

    res.status(201).json({
        status: "Success",
        data: order,
    })
})

exports.filterOrderForLoggedUser = asyncHandler(async(req,res,next)=>{
    if(req.user.role === "user"){
        req.filterObj = {user: req.user._id};
    }
    next()
})

// @desc     Get all orders
// @route    POST  /api/v1/orders
// @access   Private/use-admin-manager

exports.getAllOrders = factory.getAll(orderModel)

// @desc     Get all orders
// @route    POST  /api/v1/orders
// @access   Private/use-admin-manager
exports.getSpecificOrder = factory.getOne(orderModel)

// @desc     Update order paid status to paied
// @route    PUT  /api/v1/orders/:id/pay
// @access   Private/admin-manager

exports.updateOrderToPaid = asyncHandler(async(req,res,next)=>{

    const order = await orderModel.findByIdAndUpdate(req.params.id)

    if(!order){
        return next(new ApiError(`No order found with id ${req.params.id}`, 404))
    }
    // update order to paid
    order.isPaid = true
    order.paidAt = Date.now()

    const updatedOrder = await order.save()

    res.status(200).json({
        status: "Success",
        data: updatedOrder,
    })
})

// @desc     Update order delivered status to delivered
// @route    PUT  /api/v1/orders/:id/deliver
// @access   Private/admin-manager
exports.updateOrderToDelivered = asyncHandler(async(req,res,next)=>{

    const order = await orderModel.findByIdAndUpdate(req.params.id)

    if(!order){
        return next(new ApiError(`No order found with id ${req.params.id}`, 404))
    }
    // update order to paid
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

    res.status(200).json({
        status: "Success",
        data: updatedOrder,
    })
})

// @desc     Get checkout session from stripe and send it as response
// @route    GET  /api/v1/orders/checkout-session/cartId
// @access   Private/user

exports.checkOutSession = asyncHandler(async(req,res,next)=>{

        // app setting
        const taxPrice = 0;
        const shippingPrice = 0;

    // 1- get cart depend on cartId

    const cart = await cartModel.findById(req.params.cartId)
    if(!cart){
        return next(new ApiError(`No cart found with id ${req.params.cartId}`, 404))
    }

     // 2- Get order price depend on cart price "check if coupon apply"
    // cartPrice = total price after discount if there is discount, if no discount = total price
    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice

    const totalOrderPrice = cartPrice + taxPrice + shippingPrice

    // 3- Create stripe checkout session
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    product_data: {
                        name: `Order for ${req.user.name}`, // استخدام اسم المستخدم هنا
                    },
                    unit_amount: totalOrderPrice * 100,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get("host")}/orders`,
        cancel_url: `${req.protocol}://${req.get("host")}/cart`,
        customer_email: req.user.email,
        client_reference_id: req.params.cartId,
        metadata: req.body.shippingAddress
    });
    
    
    
    // 4- send session to response
    res.status(200).json({
        status: "Success",
        session,
    })
})