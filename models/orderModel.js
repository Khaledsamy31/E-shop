const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Order must be belong to user"]
    },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: Number,
            color: String,
            price: Number,
        }
    ],
        taxPrice:{
            type: Number,
            default: 0
        },
        shippingAddress:{
            details: String,
            phone: String,
            city: String,
            postalCode: String
        },
        shippingPrice:{
            type: Number,
            default: 0
        },
        totalOrderPrice:{
            type: Number,
        },
        paymentMethodType:{
            type: String,
            enum: ["cash", "card"], // enum to choose from 2 option
            default: "cash"
          },
          isPaid:{
            type: Boolean,
            default: false
          },
          paidAt: Date,
          isDelivered: {
            type: Boolean,
            default: false
          },
          deliveredAt: Date,

},{timestamps: true})

orderSchema.pre(/^find/, function (next){
    this.populate({path: "user", select: "name profileImg email phone"}).populate({
        path: "cartItems.product",
        select: "title imageCover price"
    })
    next();
})

module.exports = mongoose.model("Order", orderSchema)