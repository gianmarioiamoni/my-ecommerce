// models/User.js
import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }, 
    photoUrl: { type: String, default: '' },
});

export default mongoose.model('User', userSchema);

