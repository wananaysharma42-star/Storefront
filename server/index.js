import express from 'express' 
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import customerRouter from './routes/customer.routes.js'
import productRouter from './routes/product.routes.js'
import wishlistRouter from './routes/wishlist.routes.js'
import cartRouter from './routes/cart.routes.js'
import orderRouter from './routes/order.routes.js'
import cors from 'cors'

dotenv.config()
const app = express() 
const port = 8002
const dburl = process.env.dburl

mongoose.connect(dburl).then(()=>{
    console.log("DB Connected")
}).catch((err)=>{
    console.log("Error: " + err)
})

app.use(express.json()) 
app.use(cookieParser())

app.use(cors({
    origin : 'http://localhost:5173' ,
    credentials : true
}))

app.use('/customers' , customerRouter)
app.use('/products' , productRouter)
app.use('/wishlist' , wishlistRouter)
app.use('/cart' , cartRouter)
app.use('/orders', orderRouter)

app.listen(port , ()=>{
    console.log("Server Started")
})