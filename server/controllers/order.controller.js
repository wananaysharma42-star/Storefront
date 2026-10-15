import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';
import razorpay from '../config/razorpay.js';
import crypto from 'crypto';

export const createPaymentOrder = async (req, res) => {
    try {
        const customerId = req.customer._id;
        const { shippingAddress } = req.body;

        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
            return res.status(400).json({ success: false, message: "All shipping address fields are required" });
        }

        const customer = await Customer.findById(customerId).populate('cart.product');
        if (!customer || !customer.cart || customer.cart.length === 0) {
            return res.status(400).json({ success: false, message: "Your cart is empty" });
        }

        let calculatedTotal = 0;
        const orderItems = [];

        for (const cartItem of customer.cart) {
            const product = cartItem.product;
            if (!product) {
                return res.status(404).json({ success: false, message: "A product in your cart no longer exists" });
            }

            if (cartItem.quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}. Only ${product.stock} units available.`
                });
            }

            calculatedTotal += product.price * cartItem.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                image: product.image
            });
        }

        const newOrder = {
            items: orderItems,
            shippingAddress,
            totalAmount: calculatedTotal,
            paymentStatus: "PENDING",
            status: "PENDING_PAYMENT"
        };

        customer.orders.push(newOrder);
        await customer.save();

        const createdOrder = customer.orders[customer.orders.length - 1];

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(calculatedTotal * 100),
            currency: "INR",
            receipt: createdOrder._id.toString()
        });

        createdOrder.razorpayOrderId = razorpayOrder.id;
        await customer.save();

        return res.status(200).json({
            success: true,
            shopKartOrderId: createdOrder._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const customerId = req.customer._id;

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        const order = customer.orders.id(shopKartOrderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (order.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({ success: false, message: "Razorpay order ID mismatch" });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            order.paymentStatus = "FAILED";
            await customer.save();
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        order.paymentStatus = "PAID";
        order.status = "PLACED";
        order.razorpayPaymentId = razorpay_payment_id;

        for (const item of order.items) {
            const updated = await Product.findOneAndUpdate(
                { _id: item.product, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } }
            );
            if (!updated) {
                order.paymentStatus = "FAILED";
                order.status = "CANCELLED";
                await customer.save();
                return res.status(400).json({
                    success: false,
                    message: `Sorry, "${item.name}" just went out of stock. Your payment will be refunded.`
                });
            }
        }

        customer.cart = [];
        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            orderId: order._id
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const customerId = req.customer._id;
        const customer = await Customer.findById(customerId);

        const sortedOrders = customer.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return res.status(200).json({
            success: true,
            orders: sortedOrders
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const customerId = req.customer._id;

        const customer = await Customer.findById(customerId);
        const order = customer.orders.id(id);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};