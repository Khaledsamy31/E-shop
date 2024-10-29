const mongoose = require("mongoose")

// 1- create schema
const brandSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true,"brand required"],
      unique: [true, "brand must be unqie"],
      minlength: [3,"Too short brand name"],
      maxlength: [30,"Too long brand name"]
    },
    slug:{
        type: String,
        lowercase: true,
    },
    image: String,
}, 
{timestamps: true,}
)

const setImageUrl = (doc)=>{
  // return image  baseUrl + image name
// doc = document in db
if(doc.image){
  //BASE_URL in env file
  const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`
  doc.image = imageUrl
}

}

// this works on get all cat & get one cat & update cat
brandSchema.post('init', (doc) => {
setImageUrl(doc)

});
// this work on post/create cat
brandSchema.post('save', (doc) => {
setImageUrl(doc)

});

// 2- create model
// const  brandModel = mongoose.model("brand", brandSchema)

// module.exports = brandModel;

module.exports = mongoose.model("brand", brandSchema)