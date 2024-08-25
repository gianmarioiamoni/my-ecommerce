import Review from '../models/Review.js';


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