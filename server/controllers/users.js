// controllers/users.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';


function generateToken(user) {
    return jwt.sign({ email: user.email, id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new Error('Invalid token');
    }
}

export async function registerUser(req, res) {
    const { name, email, password, isAdmin } = req.body;  // aggiungi isAdmin nel body
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ name, email, password: hashedPassword, isAdmin });  // imposta isAdmin

        const token = generateToken(result);

        res.status(201).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export async function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        console.log("loginUser() - email: ", email);
        console.log("loginUser() - password: ", password);
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            console.log("loginUser() - User does not exist");
            return res.status(404).json({ message: 'User does not exist' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            console.log("loginUser() - Invalid credentials");
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log("loginUser() - User exists and password is correct");

        // const token = jwt.sign({ email: existingUser.email, id: existingUser._id, isAdmin: existingUser.isAdmin }, 'test', { expiresIn: '1h' });
        console.log("loginUser() - process.env.JWT_SECRET: ", process.env.JWT_SECRET);
        const token = generateToken(existingUser);

        console.log("loginUser() - Token generated: ", token); // Aggiungi questo per controllare il token

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        console.log("loginUser() - Error: ", error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}


export async function updateUser(req, res) {
    const { id } = req.params;
    const { currentPassword, password, ...otherUpdates } = req.body;

    try {
        console.log("updateUser() - id: ", id);
        console.log("updateUser() - currentPassword: ", currentPassword);
        console.log("updateUser() - password: ", password);
        console.log("updateUser() - otherUpdates: ", otherUpdates);

        const user = await User.findById(id);
        if (!user) {
            console.log("updateUser() - User not found");
            return res.status(404).json({ message: 'User not found' });
        }

        // Se una nuova password è fornita, criptala
        if (password) {
            console.log("updateUser() - Checking current password");
            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordCorrect) {
                console.log("updateUser() - Invalid current password");
                return res.status(400).json({ message: 'Invalid current password' });
            }

            console.log("updateUser() - Hashing new password");
            otherUpdates.password = await bcrypt.hash(password, 12);
        }

        console.log("updateUser() - Updating user");
        const updatedUser = await User.findByIdAndUpdate(id, otherUpdates, { new: true });
        console.log("updateUser() - User updated: ", updatedUser);

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("updateUser() - Error: ", error);
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

