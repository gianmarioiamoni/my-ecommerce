// /models/eventModel.js
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventType: { type: String, required: true }, // e.g. 'click', 'view', 'purchase'
    timestamp: { type: Date, default: Date.now },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // optional
    metadata: { type: Object } // other data for the event
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
