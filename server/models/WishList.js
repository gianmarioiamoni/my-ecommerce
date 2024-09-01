// models/Wishlist.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const WishlistSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, {
    timestamps: true
});

const Wishlist = mongoose.model('Wishlist', WishlistSchema);
export default Wishlist;
