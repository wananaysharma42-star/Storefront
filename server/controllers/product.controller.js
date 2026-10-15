import Product from "../models/product.model.js"

export const addProduct = async (req , res)=>{
    try{
        let {name , description , price , category , image , stock} = req.body 

        if(!name || !price || !category || !image || !stock){
            return res.status(400).json({success : false , message : "missing required feilds"})
        }

        price = Number(price) 
        if(isNaN(price) || price <= 0){
            return res.status(400).json({success : false , message : "invalid price value"})
        }

        stock = Number(stock) 
        if(isNaN(stock) || stock < 0){
            return res.status(400).json({success : false , message : "invalid stock value"})
        }

        const newProduct = await Product.create({
            name ,
            description ,
            price ,
            category ,
            image ,
            stock
        })

        return res.status(201).json({success : true , message : "product added successfully"})
    }catch(err){
        return res.status(500).json({success : false , message : "Internal Server Error" , error : err})
    }
}

export const getAllProducts = async (req , res)=>{
    try{
        const {search , category} = req.query
        let query = {}

        if(search){
            query.name = {$regex : search , $options : 'i'}
        }

        if(category){
            query.category = category
        }

        const products = await Product.find(query).select('name price category image stock')

        res.status(200).json({success : true , count : products.length , products : products})
    }catch(err){
        res.status(500).json({success : false , message : "Internal Server Error" , error : err})
    }
}

export const getProduct = async (req , res)=>{
    try{
        const {id} = req.params

        const product = await Product.findById(id) 

        if(!product){
            return res.status(404).json({success : false , message : "product not found"})
        }

        return res.status(200).json({success : true , product : product})
    }catch(err){
        res.status(500).json({success : false , message : "Internal Server Error" , error : err})
    }
}