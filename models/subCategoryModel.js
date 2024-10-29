const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "subCategory must be unique"],
      minlength: [2, "Too short subCategory name"],
      maxlength: [30, "Too long subCategory name"],
    },

    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "subCategory must be belong to parent category"],
    },
  },
  { timestamps: true }
  
);

// to do populate to category name of subcategory
// mongoose query middleware (/^find/) = if part of the word content "find" do this function
subCategorySchema.pre(/^find/, function (next){
  this.populate({
      path: 'category',
      select: 'name'
  })
  next()
})

module.exports = mongoose.model("SubCategory", subCategorySchema);
