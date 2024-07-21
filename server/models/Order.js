import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    paypalOrderId: {
        type: String,
        // required: true,
        unique: true,
    },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
