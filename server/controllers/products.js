import mongoose from 'mongoose';

import Product from '../models/Product.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';


// Fetch all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch a single product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new product
export const createProduct = async (req, res) => {
    const productData = req.body;
    const newProduct = new Product(productData);

    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createReview = async (req, res) => {
    const { rating, comment } = req.body;
    const { productId } = req.params;
    const userId = req.user.id;

    try {
        console.log(`Creating review for product ID: ${productId} by user ID: ${userId}`);

        // Verify if the product exists 
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the user has purchased the product
        const hasPurchased = await Order.exists({
            userId: new mongoose.Types.ObjectId(userId), 
            'products.product': new mongoose.Types.ObjectId(productId), 
            status: 'Delivered'  // Consider only delivered products
        });

        if (!hasPurchased) {
            return res.status(403).json({ message: 'You can only review products you have purchased' });
        }

        // Create the new review
        const newReview = new Review({
            userId,
            productId,
            rating,
            comment
        });

        // Save the review
        await newReview.save();

        // Update the product average rating
        // product.reviews.push(newReview._id);
        // await product.save();

        return res.status(201).json(newReview);
    } catch (error) {
        console.error('Error creating review:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get all reviews for a product
export const getProductReviews = async (req, res) => {
    const { productId } = req.params;

    try {
        const reviews = await Review.find({ productId, isApproved: true }).populate('userId', 'name photoUrl');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


