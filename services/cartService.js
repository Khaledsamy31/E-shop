const asyncHandler = require("express-async-handler")
const ApiError = require("../utils/apiError")
const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const couponModel = require("../models/couponModel");

// func to calculate total price
const calcTotalCartPrice  = (cart)=> {

    let totalPrice = 0;
    cart.cartItems.forEach(item => totalPrice += item.price * item.quantity)
    cart.totalCartPrice = totalPrice
    cart.totalPriceAfterDiscount = undefined; // to show price after discount when apply coupon only
    return totalPrice
} 

// @desc     Add product To Cart
// @route    POST  /api/v1/cart
// @access   Private/user

exports.addProductToCart = asyncHandler(async (req, res, next)=>{
    //get this from body
    const {productId, color} = req.body;

    const product = await productModel.findById(productId) // to get the product by id we send in body
    //1- Get Cart Of Logged User
    let cart = await cartModel.findOne({user: req.user._id});

    if(!cart){
        // if there is no cart create new cart for logged user and add products in it
     cart = await cartModel.create({
            user: req.user._id,
            cartItems: [{product: productId, color, price: product.price}]
            })
    }else{
        // if there is cart & choosen product is existed in cart & color = color do update product quantity
        const productExistIndex = cart.cartItems.findIndex(
            item => item.product.toString() === productId && item.color === color
            )
            
            if(productExistIndex > -1){
                // update product quantity
                const cartItem = cart.cartItems[productExistIndex]
                cartItem.quantity += 1;
                cart.cartItems[productExistIndex] = cartItem;
            }else{
                // if there is cart & choosed product not existed in cart do push product to cart
                cart.cartItems.push({product: productId, color, price: product.price})

            }

    }
        // Calculate total price
        calcTotalCartPrice(cart)
    
        // save cart to db
        await cart.save()
        res.status(200).json({status: "Success",numberOfCartItems: cart.cartItems.length, message: "Product added to cart", data: cart})
})

// @desc     Get cart of logged user
// @route    POST  /api/v1/cart
// @access   Private/user

exports.getLoggedUserCart = asyncHandler(async (req, res, next)=>{
    const cart = await cartModel.findOne({user: req.user._id})
    if(!cart){
        return next(new ApiError(`There is no cart for user id ${req.user._id}`, 404))
    }
    res.status(200).json({status: "Success", numberOfCartItems: cart.cartItems.length, data: cart})
})

// @desc     remove specific cart item
// @route    DELETE  /api/v1/cart/:itemId
// @access   Private/user

exports.removeCartItem = asyncHandler(async (req, res, next)=>{
    const cart = await cartModel.findOneAndUpdate(
        {user: req.user._id},
        {
            // cartItems is the array that we wanna remove item from it
            $pull: { cartItems: { _id: req.params.itemId } }
        },
        {new:true})

        calcTotalCartPrice(cart)
        cart.save()
    if(!cart){
        return next(new ApiError(`There is no cart for user id ${req.user._id}`, 404))
    }

    res.status(200).json({status: "Success", numberOfCartItems: cart.cartItems.length, data: cart})

})

// @desc     clear all logged user cart
// @route    DELETE  /api/v1/cart
// @access   Private/user

exports.clearCart = asyncHandler(async (req, res, next)=>{
    const cart = await cartModel.findOneAndDelete({user: req.user._id})
    if(!cart){
        return next(new ApiError(`There is no cart for user id ${req.user._id}`, 404))
    }

    res.status(204).send()

})

// @desc     Update specific cart item quantity
// @route    PUT  /api/v1/cart/:itemId
// @access   Private/user

exports.updateCartItemQuantity = asyncHandler(async (req, res, next)=>{
    const { quantity} = req.body;
    const cart = await cartModel.findOne({user: req.user._id})

    if(!cart){
        return next(new ApiError(`There is no cart for user id ${req.user._id}`, 404))
    }
    // to find cart item that === item id in params
    const itemIndex = cart.cartItems.findIndex(item => item._id.toString() === req.params.itemId)


    if(itemIndex > -1){
       const cartItem = cart.cartItems[itemIndex];
       cartItem.quantity = quantity;
       cart.cartItems[itemIndex] = cartItem;
    }else{
        return next(new ApiError(`Item not found in cart of user id ${req.user._id}`, 404))
    }
    calcTotalCartPrice(cart)
    await cart.save()
    res.status(200).json({status: "Success", numberOfCartItems: cart.cartItems.length, data: cart})
})

// @desc     Apply coupon on logged user cart
// @route    PUT  /api/v1/cart/applyCoupon
// @access   Private/user

exports.applyCoupon = asyncHandler(async (req, res, next)=>{

    // 1- GET coupon based on coupon name
    // to get from model > name.. get req.body.coupon & expire > date.now to get valid coupon
    const coupon = await couponModel.findOne({name: req.body.coupon, expire: {$gt: Date.now()}})

    if(!coupon){
        return next(new ApiError(`Coupon is invalid or expired`, 404))
    }

    // 2- get logged user cart to get total price
    const cart = await cartModel.findOne({user: req.user._id})

    if(!cart){
        return next(new ApiError(`Cart not found to apply this coupon`, 404))
    }

    const totalPrice = cart.totalCartPrice

    // 3- Calculate price after discount
    const totalPriceAfterDiscount = (totalPrice - (totalPrice * coupon.discount / 100)).toFixed(2) // to get 2 value like 99.23
   
    cart.totalPriceAfterDiscount = totalPriceAfterDiscount
    await cart.save()
   
    res.status(200).json({status: "Success", numberOfCartItems: cart.cartItems.length, message: "Coupon applied successfully", data: cart})

})