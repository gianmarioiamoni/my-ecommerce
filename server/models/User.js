import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    name: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: { type: Boolean, default: false }
});

const paymentMethodSchema = new mongoose.Schema({
    cardType: String,
    last4Digits: String,
    cardNumber: String,
    expiryDate: String,
    isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    photoUrl: { type: String, default: '' },
    addresses: [addressSchema],
    paymentMethods: [paymentMethodSchema],
    resetPasswordToken: String,
    resetPasswordExpires: Date
});


const User = mongoose.model('User', userSchema);

export default User;

