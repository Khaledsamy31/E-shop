const mongoose = require("mongoose")

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Coupon Name is required"],
        minlength: [3,"Too short coupon name"],
        maxlength: [30,"Too long coupon name"],
        trim: true
    },
    expire: {
        type: Date,
        required: [true,"Coupon Expire Date is required"]
    },
    discount: {
        type: Number,
        required: [true,"Coupon Discount is required"],
        min: [0, "Coupon Discount must be greater than or equal to 0"],
        max: [100, "Coupon Discount must be less than or equal to 100"]
    }
},{timestamps: true})

module.exports = mongoose.model("Coupon", couponSchema)
