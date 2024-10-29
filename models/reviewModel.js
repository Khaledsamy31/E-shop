const mongoose = require("mongoose")
const productModel = require("./productModel")

const reviewSchema = new mongoose.Schema({

    title: {
        type: String,
        minlength: [3, "Too short review title"],
        maxlength: [100, "Too long review title"],
        trim: true
    },
    ratings: {
        type: Number,
        min: [1, "Min rating value is 1.0"],
        max: [5, "Max rating value is 5.0"],
        required: [true, "review reatings is required"]
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "review must belong to user"]

    },
    // parent reference (1 to man relation) we use it if there is many items
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "review must belong to product"]
    },
},{timestamps: true})

// to return user name in review to know the review owner
reviewSchema.pre(/^find/, function(next) {this.populate({ path: "user", select: "name" })
    next();
})

// to calculate average ratings and quantity of reviews for a specific product
reviewSchema.statics.calcAverageRatingsAndQuantity = async function(productId){
 const result = await  this.aggregate([
    // stage 1- get all reviews in specific product
    {
        $match: {product: productId}
    },
    {
        // stage 2- calculate average ratings
        $group: {
            _id: "product",
            averageRating: { $avg: "$ratings" },
            ratingsQuantity: { $sum: 1 }
        }
    }
 ])

// console.log(result)

 if(result.length > 0){
    await productModel.findByIdAndUpdate(productId,{
        ratingsAverage: result[0].averageRating,
        ratingsQuantity: result[0].ratingsQuantity
    })
 }else{
    await productModel.findByIdAndUpdate(productId,{
        ratingsAverage: 0,
        ratingsQuantity: 0
    })
 }

}

reviewSchema.post("save", async function(){
  await  this.constructor.calcAverageRatingsAndQuantity(this.product)
})

reviewSchema.post("remove", async function(){
  await  this.constructor.calcAverageRatingsAndQuantity(this.product)
})

module.exports = mongoose.model("Review", reviewSchema)