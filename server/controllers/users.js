// controllers/users.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

import crypto from 'crypto';
import nodemailer from 'nodemailer';


function generateToken(user) {
    return jwt.sign(
        {
            name: user.name,
            email: user.email,
            id: user._id,
            isAdmin: user.isAdmin,
            photoUrl: user.photoUrl,
            addresses: user.addresses,
            paymentMethods: user.paymentMethods
        },
        process.env.JWT_SECRET,
        // { expiresIn: '1h' }
        { expiresIn: '1w' }
    );
}

function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new Error('Invalid token');
    }
}


export async function getAllUsers(req, res) {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
}


export async function registerUser(req, res) {
    const { name, email, password, isAdmin } = req.body;  
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

        const token = generateToken(existingUser);

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
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (password) {
            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: 'Invalid current password' });
            }
            otherUpdates.password = await bcrypt.hash(password, 12);
        }

        const updatedUser = await User.findByIdAndUpdate(id, otherUpdates, { new: true });

        // Genera un nuovo token con i dati aggiornati
        const token = generateToken(updatedUser);

        res.status(200).json({ user: updatedUser, token });
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

export async function forgotPassword(req, res) {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Genera un token di reset
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 ora

        // Salva il token e la sua scadenza nel database (es. nel modello utente)
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // Invia l'email con il link di reset
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            to: user.email,
            from: 'no-reply@yourdomain.com',
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested to reset your password.\n\n
            Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
            https://${req.headers.host}/reset-password/${resetToken}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        console.log('Sending password reset email...');
        await transporter.sendMail(mailOptions);

        console.log('Password reset email sent');

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}


export async function getResetPasswordPage(req, res) {

    const { token } = req.params;

    try {
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) {
            console.log("User not found or token is invalid or expired");
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }   

        res.status(200).render('reset-password', { token });
    } catch (error) {
        console.error("Error occurred during password reset:", error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
}


export async function resetPassword(req, res) {

    const { token, password } = req.body;

    try {
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            console.log("User not found or token is invalid or expired");
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined; // Remove the reset token when used 
        user.resetPasswordExpires = undefined; // Remove expiration date

        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error("Error occurred during password reset:", error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
}

// SHIPPING ADDRESSES AND PAYMENT METHODS

export const getShippingAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).send('User not found');

        res.status(200).json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const addShippingAddress = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('User not found');

        user.addresses.push(req.body);
        await user.save();
        res.status(201).json(user.addresses[user.addresses.length - 1]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPaymentMethods = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).send('User not found');

        res.status(200).json(user.paymentMethods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const addPaymentMethod = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('User not found');

        user.paymentMethods.push(req.body);
        await user.save();
        res.status(201).json(user.paymentMethods[user.paymentMethods.length - 1]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export async function deleteShippingAddress(req, res) {
    const { id, addressId } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.addresses = user.addresses.filter(address => address._id.toString() !== addressId);
        await user.save();
        
        res.status(200).json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}


export async function updatePaymentMethod(req, res) {
    const { id, paymentMethodId } = req.params;
    const { cardType, last4Digits, expiryDate, isDefault } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const paymentMethod = user.paymentMethods.id(paymentMethodId);
        if (!paymentMethod) return res.status(404).json({ message: 'Payment method not found' });

        if (isDefault) {
            user.paymentMethods.forEach(pm => pm.isDefault = false);
        }

        paymentMethod.cardType = cardType || paymentMethod.cardType;
        paymentMethod.last4Digits = last4Digits || paymentMethod.last4Digits;
        paymentMethod.expiryDate = expiryDate || paymentMethod.expiryDate;
        paymentMethod.isDefault = isDefault;

        await user.save();
        res.status(200).json(user.paymentMethods);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export async function deletePaymentMethod(req, res) {
    const { id, paymentMethodId } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.paymentMethods = user.paymentMethods.filter(pm => pm._id.toString() !== paymentMethodId);
        await user.save();
        res.status(200).json(user.paymentMethods);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}



