import express from 'express' 
import { addProduct, getAllProducts, getProduct } from '../controllers/product.controller.js'

const productRouter = express.Router() 

productRouter.post('/add' , addProduct) 
productRouter.get('/all' , getAllProducts)
productRouter.get('/:id' , getProduct)

export default productRouter