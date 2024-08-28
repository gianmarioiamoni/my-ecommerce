import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrls: [{ type: String, required: true }],
    availability: { type: String, required: true, default: 'In Stock' },
    category: { type: String, required: false },
    quantity: { type: Number, required: true, default: 0 },
    averageRating: { type: Number, default: 0 }, 
    reviewCount: { type: Number, default: 0 }, 
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

const Product = mongoose.model('Product', productSchema);

export default Product;