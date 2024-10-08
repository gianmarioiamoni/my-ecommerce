import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    // isApproved: { type: Boolean, default: false } // with moderation
    isApproved: { type: Boolean, default: true } // no moderation
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
