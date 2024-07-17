import Order from '../models/Order.js';

// Create a new order
export const createOrder = async (req, res) => {
    const { products, totalAmount } = req.body;

    const newOrder = new Order({
        products,
        totalAmount,
    });

    try {
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Fetch all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('products.product');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch a single order by ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('products.product');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
