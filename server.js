const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const path = require("path")
const cors = require('cors')
const compression = require('compression')



//to get info from config.env
dotenv.config({path:"config.env"})

const {webhookCheckOut} = require('./services/orderService')


const ApiError = require("./utils/apiError")
const globalError = require("./middlewares/errorMiddleware")
const dbConnection = require("./config/database")

// routes

// "./routes" = "./routes/index"
const mountRoutes = require("./routes")

// const categoryRoute = require("./routes/categoryRoute")
// const subCategoryRoute = require("./routes/subCategoryRoute")
// const brandRoute = require("./routes/brandRoute")
// const productRoute = require("./routes/productRoute")
// const userRoute = require("./routes/userRoute")
// const authRoute = require("./routes/authRoute")
// const reviewRoute = require("./routes/reviewRoute")
// const wishListRoute = require("./routes/wishListRoute")
// const addressRoute = require("./routes/addressRoute")
// const couponsRoute = require("./routes/couponRoute")

// to connect db
dbConnection();



//express app
const app = express();

// to Enable other domains to access your app
app.use(cors())
app.options('*', cors())
app.use(compression())

// checkout webhook
app.post("/webhook-checkout",
     express.raw({type: "application/json"}),
      webhookCheckOut
        )

app.use(express.static(path.join(__dirname, "uploads")))

//middleware before route
app.use(express.json()) //to make parseing for data that comming from postman
if(process.env.NODE_ENV === "development"){

    app.use(morgan('dev'))
    console.log(`mode: ${process.env.NODE_ENV}`)
}


// Mount Routes

mountRoutes(app) // get it from route/index file

// app.use("/api/v1/categories",categoryRoute)
// app.use("/api/v1/subcategories",subCategoryRoute)
// app.use("/api/v1/brands",brandRoute)
// app.use("/api/v1/products",productRoute)
// app.use("/api/v1/users",userRoute)
// app.use("/api/v1/auth",authRoute)
// app.use("/api/v1/reviews",reviewRoute)
// app.use("/api/v1/wishlist",wishListRoute)
// app.use("/api/v1/addresses",addressRoute)
// app.use("/api/v1/coupons",couponsRoute)

app.all("*", (req, res, next)=>{

    next(new ApiError(`Can't fint this route: ${req.originalUrl}`, 400)) //ApiError(message, status)

})

// globale error handling middleware for express
app.use(globalError)


//to get port from config.env
const PORT= process.env.PORT || 8000;
const server = app.listen(PORT,()=>{
    console.log(`App running on port ${PORT}`)
})


// to handle rejection errors (errors that not from express || outside express)
process.on('unhandledRejection', (err) => {
    console.error(`UnhandledRejection ${err.name} | ${err.message}`)
    //to close app if there is an error not from express
    server.close(()=>{
        console.error(`Shutting down...`)
        process.exit(1)
    })
  });