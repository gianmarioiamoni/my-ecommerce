import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    // imageUrls in an array of strings
    imageUrls: [{ type: String, required: true }],
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
