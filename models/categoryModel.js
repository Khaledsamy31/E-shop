const mongoose = require("mongoose")

// 1- create schema
const categorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true,"Category required"],
      unique: [true, "Category must be unqie"],
      minlength: [3,"Too short category name"],
      maxlength: [30,"Too long category name"]
    },
    slug:{
        type: String,
        lowercase: true,
    },
    image: String,
}, 
{timestamps: true,}
);

const setImageUrl = (doc)=>{
    // return image  baseUrl + image name
  // doc = document in db
  if(doc.image){
    //BASE_URL in env file
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`
    doc.image = imageUrl
  }

}

// this works on get all cat & get one cat & update cat
categorySchema.post('init', (doc) => {
  setImageUrl(doc)

});
// this work on post/create cat
categorySchema.post('save', (doc) => {
  setImageUrl(doc)

});

// 2- create model
const  CategoryModel = mongoose.model("Category", categorySchema)

module.exports = CategoryModel;