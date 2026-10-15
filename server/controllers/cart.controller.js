import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';
import mongoose from 'mongoose';

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.customer._id;
        const { quantity = 1 } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const customer = await Customer.findById(customerId);
        const existingItem = customer.cart.find(
            item => item.product.toString() === productId
        );

        let targetQuantity = quantity;
        if (existingItem) {
            targetQuantity = existingItem.quantity + quantity;
        }

        if (targetQuantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: `Cannot add more items. Only ${product.stock} units available in stock.`
            });
        }

        if (existingItem) {
            existingItem.quantity = targetQuantity;
        } else {
            customer.cart.push({ product: productId, quantity });
        }

        await customer.save();

        const updatedCustomer = await Customer.findById(customerId).populate({
            path: "cart.product",
            select: "name description price category image stock"
        });

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: updatedCustomer.cart
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const customerId = req.customer._id;

        const customer = await Customer.findById(customerId).populate({
            path: "cart.product",
            select: "name description price category image stock"
        });

        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        return res.status(200).json({
            success: true,
            cart: customer.cart
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.customer._id;
        const { quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        if (typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: `Quantity exceeds available stock (${product.stock})`
            });
        }

        const customer = await Customer.findById(customerId);
        const existingItem = customer.cart.find(
            item => item.product.toString() === productId
        );

        if (!existingItem) {
            return res.status(404).json({ success: false, message: "Product not in cart" });
        }

        existingItem.quantity = quantity;
        await customer.save();

        const updatedCustomer = await Customer.findById(customerId).populate({
            path: "cart.product",
            select: "name description price category image stock"
        });

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated",
            cart: updatedCustomer.cart
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.customer._id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        const customer = await Customer.findById(customerId);
        const initialLength = customer.cart.length;

        customer.cart = customer.cart.filter(
            item => item.product.toString() !== productId
        );

        if (customer.cart.length === initialLength) {
            return res.status(404).json({ success: false, message: "Product not in cart" });
        }

        await customer.save();

        const updatedCustomer = await Customer.findById(customerId).populate({
            path: "cart.product",
            select: "name description price category image stock"
        });

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: updatedCustomer.cart
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};