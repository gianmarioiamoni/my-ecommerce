import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

import mongoose from 'mongoose';

/**
 * Get all reviews for a product
 *
 * @param {Object} req The Express request object
 * @param {Object} res The Express response object
 * @param {string} req.params.productId The ID of the product to get the reviews for
 *
 * @returns {Promise<void>}
 */
export const getProductReviews = async (req, res) => {
    const { productId } = req.params;

    try {
        // Find all reviews for the product with isApproved set to true
        // Populate the userId field with the user's name and photoUrl
        const reviews = await Review.find({ productId, isApproved: true }).populate('userId', 'name photoUrl');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


/**
 * Creates a new review for the given product
 *
 * @param {Object} req The Express request object
 * @param {Object} res The Express response object
 * @param {string} req.params.productId The ID of the product to review
 * @param {Object} req.body The request body containing the review data
 * @param {number} req.body.rating The rating of the review
 * @param {string} req.body.comment The comment for the review
 *
 * @returns {Promise<void>}
 */
export const createReview = async (req, res) => {
    const { rating, comment } = req.body;
    const { productId } = req.params;
    const userId = req.user.id;

    try {
        // Find the product to review
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the user has purchased the product
        // We consider only delivered products
        const hasPurchased = await Order.exists({
            userId: new mongoose.Types.ObjectId(userId),
            'products.product': new mongoose.Types.ObjectId(productId),
            status: 'Delivered'
        });

        if (!hasPurchased) {
            return res.status(403).json({ message: 'You can only review delivered products you have purchased' });
        }

        // Create and save the new review
        const newReview = new Review({
            userId,
            productId,
            rating,
            comment
        });
        await newReview.save();

        // Update the product average rating and review count
        const totalReviews = await Review.countDocuments({ productId });
        const avgRating = await Review.aggregate([
            { $match: { productId: new mongoose.Types.ObjectId(productId) } },
            { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]);

        // Update the product with the new review count and average rating
        product.reviewCount = totalReviews;
        product.averageRating = avgRating[0]?.avgRating || 0;
        await product.save();

        return res.status(201).json(newReview);
    } catch (error) {
        console.error('Error creating review:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


// update a review
/**
 * Updates a review in the database
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 */
export const updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    try {
        // Find the review in the database
        const review = await Review.findById(reviewId).populate('userId');

        if (!review) {
            console.log('Review not found');
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the user is authorized to edit the review
        if (review.userId._id.toString() !== req.user.id.toString()) {
            console.log('Unauthorized to edit review');
            return res.status(403).json({ message: 'You are not authorized to edit this review' });
        }

        // Update the review and update the rating and comment in the database
        review.rating = rating;
        review.comment = comment;

        await review.save();

        return res.status(200).json(review);
    } catch (error) {
        console.error('Error in updateReview:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

// Approve a review
/**
 * Approves a review in the database
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {String} req.params.reviewId - The id of the review to approve
 */
export const approveReview = async (req, res) => {
    const { reviewId } = req.params;

    try {
        // Find the review in the database
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Update the review and set isApproved to true
        review.isApproved = true;
        await review.save();

        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

/**
 * Gets the review of a specific user for a specific product
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {String} req.params.productId - The id of the product to get the reviews for
 * @param {String} req.params.userId - The id of the user to get the reviews for
 */
export const getProductUserReview = async (req, res) => {
    const { productId, userId } = req.params;   

    try {
        const review = await Review.findOne({ productId, userId });
        if (!review) {
            return res.status(404).json({ message: 'No review found for this user and product' });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}


