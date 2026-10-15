import jwt from 'jsonwebtoken';
import Customer from '../models/customer.model.js';

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Not authenticated. Please login." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const customer = await Customer.findById(decoded.id);

        if (!customer) {
            return res.status(401).json({ success: false, message: "User not found or session expired." });
        }

        req.customer = customer; 
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};