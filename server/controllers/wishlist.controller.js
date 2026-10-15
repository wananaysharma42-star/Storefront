import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';
import mongoose from 'mongoose';

export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.customer._id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const customer = await Customer.findById(customerId);
        
        const existingItem = customer.wishlist.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            return res.status(400).json({
                success: false,
                message: "Product already in wishlist"
            });
        }

        customer.wishlist.push({ product: productId, quantity: 1 });
        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Wishlist updated successfully",
            wishlist: customer.wishlist
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const customerId = req.customer._id;

        const customer = await Customer.findById(customerId).populate({
            path: "wishlist.product",
            select: "name description price category image stock"
        });

        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        return res.status(200).json({
            success: true,
            count: customer.wishlist.length,
            wishlist: customer.wishlist
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.customer._id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        const customer = await Customer.findById(customerId);
        const initialLength = customer.wishlist.length;

        customer.wishlist = customer.wishlist.filter(
            item => item.product.toString() !== productId
        );

        if (customer.wishlist.length === initialLength) {
            return res.status(404).json({ success: false, message: "Product not in wishlist" });
        }

        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist"
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};