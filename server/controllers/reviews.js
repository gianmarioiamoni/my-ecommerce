import Review from '../models/Review.js';

// update a review
export const updateReview = async (req, res) => {
    console.log('updateReview called');
    console.log('req.params:', req.params);
    console.log('req.body:', req.body);

    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        const review = await Review.findById(reviewId).populate('userId');

        if (!review) {
            console.log('Review not found');
            return res.status(404).json({ message: 'Review not found' });
        }
        console.log('review:', review);

        // Check if the user is authorized to edit the review 
        if (review.userId._id.toString() !== req.user.id.toString()) {
            console.log('Unauthorized to edit review');
            return res.status(403).json({ message: 'You are not authorized to edit this review' });
        }

        // Update the review and update the rating and comment in the database
        review.rating = rating;
        review.comment = comment;
        console.log('review after update:', review);

        await review.save();

        console.log('Review updated successfully');
        return res.status(200).json(review);
    } catch (error) {
        console.error('Error in updateReview:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

// approve a review
export const approveReview = async (req, res) => {
    const { reviewId } = req.params;

    try {
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.isApproved = true;
        await review.save();
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

// get reviews of a specific user for a specific product
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


