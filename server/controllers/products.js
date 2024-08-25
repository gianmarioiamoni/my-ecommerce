import Product from '../models/Product.js';
import Review from '../models/Review.js';

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

// Create a review for a product
export const createReview = async (req, res) => {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    console.log('Create Review - productId:', productId);
    console.log('Create Review - rating:', rating);
    console.log('Create Review - comment:', comment);

    try {
        const product = await Product.findById(productId);
        if (!product) {
            console.log('Create Review - Product not found');
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log('Create Review - Product found');

        // Verify that the user has not already reviewed the product
        const existingReview = await Review.findOne({ productId, userId });
        if (existingReview) {
            console.log('Create Review - Existing review found');
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        console.log('Create Review - Existing review not found');

        // Create a new review
        const review = new Review({
            productId,
            userId,
            rating,
            comment,
            isApproved: false // Initially, the review is not approved
        });

        console.log('Create Review - New review created');

        await review.save();
        res.status(201).json(review);
    } catch (error) {
        console.log('Create Review - Error', error);
        res.status(500).json({ message: 'Server error' });
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


