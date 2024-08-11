// models/User.js
import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    photoUrl: { type: String, default: '' },
    resetPasswordToken: { type: String },  // Campo per memorizzare il token di reset
    resetPasswordExpires: { type: Date }  // Campo per memorizzare la scadenza del token
});

export default mongoose.model('User', userSchema);