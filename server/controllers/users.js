// controllers/users.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function registerUser(req, res) {
    const { name, email, password, isAdmin } = req.body;  // aggiungi isAdmin nel body
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ name, email, password: hashedPassword, isAdmin });  // imposta isAdmin

        const token = jwt.sign({ email: result.email, id: result._id, isAdmin: result.isAdmin }, 'test', { expiresIn: '1h' });

        res.status(201).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export async function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) return res.status(404).json({ message: 'User does not exist' });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id, isAdmin: existingUser.isAdmin }, 'test', { expiresIn: '1h' });

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export async function updateUser(req, res) {
    const { id } = req.params;
    console.log("updateUser() - id: ", id);
    console.log("updateUser() - req.body: ", req.body);
    try {
        const user = await User.findById(id);
        console.log("updateUser() - user: ", user);
        if (!user) return res.status(404).json({ message: 'User not found' }); 

        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        console.log("updateUser() - updatedUser: ", updatedUser);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export async function deleteUser(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });  

        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}   

