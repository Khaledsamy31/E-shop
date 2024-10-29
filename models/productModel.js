const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true,"Product Title is required"],
        minlength: [3,"Too short product title"],
        maxlength: [100,"Too long product title"],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
    },
    description:{
        type: String,
        required: [true,"Product Description is required"],
        minlength: [10,"Too short product description"],
        maxlength: [500,"Too long product description"],
        trim: true
    },
    quantity:{
        type: Number,
        required: [true,"Product Quantity is required"],
        min: 1,
    },
    sold:{
        type: Number,
        default: 0
    },
    price:{
        type: Number,
        required: [true,"Product Price is required"],
        min: 0,
        trim: true,
        maxlength: [20, "Too long product price"]
    },
    priceAfterDiscount:{
        type: Number,
        trim: true,
        min: 0,
        maxlength: [20, "Too long product price"]
    },
    colors: [String],

    imageCover: {
        type: String,
        required: [true,"Product Image Cover is required"],
       
    },

    images: [String],

    category:{
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        required: [true, "Product must belong to a category"]
    },
    subCategories:[
        {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
    }
    ] ,
    brand: {
        type: mongoose.Schema.ObjectId,
        ref: "Brand",
    },
    ratingsAverage:{
        type: Number,
        min: [1, "rating must be above or equal 1.0"],
        max: [5,"rating must be below or equal 5.0"]
    },
    ratingsQuantity:{
        type:Number,
        default: 0
    }
},{timestamps: true, 
    // to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// to get all reviews on product field that id of prod in review = id of prod doc
productSchema.virtual("reviews",{
    ref: "Review",
    foreignField: "product",
    localField: "_id"
})
// to do populate to category name of product
// mongoose query middleware (/^find/) = if part of the word content "find" do this function
productSchema.pre(/^find/, function (next){
    this.populate({
        path: 'category',
        select: 'name -_id'
    })
    next()
})

const setImageUrl = (doc) => {
    // إذا كانت هناك صورة رئيسية (imageCover)
    if (doc.imageCover) {
      const imageCoverUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
      doc.imageCover = imageCoverUrl;
    }
  
    // إذا كانت هناك صور متعددة (images)
    if (doc.images && Array.isArray(doc.images)) {
      const updatedImages = doc.images.map(image => `${process.env.BASE_URL}/products/${image}`);
      doc.images = updatedImages;
    }
  };
  
  // يطبق الـ middleware على جلب جميع المستندات أو مستند واحد أو التحديث
  productSchema.post('init', (doc) => {
    setImageUrl(doc);
  });
  
  // يطبق الـ middleware على إضافة منتج جديد أو حفظه
  productSchema.post('save', (doc) => {
    setImageUrl(doc);
  });
  


module.exports = mongoose.model("Product", productSchema)