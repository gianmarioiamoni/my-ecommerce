// controllers/users.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

import crypto from 'crypto';
import nodemailer from 'nodemailer';


/**
 * Generates a JSON Web Token (JWT) for the given user.
 * The token is signed with the `JWT_SECRET` environment variable.
 * The payload of the token contains the user's name, email, id, isAdmin flag,
 * photoUrl, addresses, paymentMethods, and language.
 * The token is valid for 1 week.
 * @param {User} user - the user to generate a token for
 * @return {String} the generated JWT
 */
function generateToken(user) {
    return jwt.sign(
        {
            name: user.name,
            email: user.email,
            id: user._id,
            isAdmin: user.isAdmin,
            photoUrl: user.photoUrl,
            addresses: user.addresses,
            paymentMethods: user.paymentMethods,
            language: user.language
        },
        process.env.JWT_SECRET,
        // { expiresIn: '1h' }
        { expiresIn: '1w' }
    );
}

/**
 * Verifies a given JSON Web Token (JWT) and returns the decoded user
 * information if the token is valid.
 *
 * @param {string} token - the JWT to verify
 * @return {object} the decoded user information
 * @throws {Error} if the token is invalid
 */
function verifyToken(token) {
    try {
        /**
         * The `jwt.verify` function verifies the given token and returns the
         * decoded payload. If the token is invalid, it throws an error.
         */
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new Error('Invalid token');
    }
}


/**
 * Retrieves all users from the database.
 * 
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * 
 * @return {Promise<void>}
 */
export async function getAllUsers(req, res) {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
}


/**
 * Registers a new user in the database.
 * 
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * 
 * @return {Promise<void>}
 */
export async function registerUser(req, res) {
    const { name, email, password, isAdmin } = req.body;  
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the given password with a salt of 12
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new User document with the given information and
        // set the isAdmin field to the given value
        const result = await User.create({ name, email, password: hashedPassword, isAdmin });  

        // Generate a JSON Web Token (JWT) for the newly created user
        const token = generateToken(result);

        res.status(201).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

/**
 * Logs in a user and returns a JSON Web Token
 * 
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * 
 * @return {Promise<void>}
 */
export async function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        // Find a user with the given email
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            console.log("loginUser() - User does not exist");
            return res.status(404).json({ message: 'User does not exist' });
        }

        // Check if the given password matches the user's password
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            console.log("loginUser() - Invalid credentials");
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JSON Web Token for the user
        const token = generateToken(existingUser);

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        console.log("loginUser() - Error: ", error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}


/**
 * Updates a user and returns the updated user and a new JSON Web Token
 * 
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * 
 * @return {Promise<void>}
 */
export async function updateUser(req, res) {
    const { id } = req.params;
    const { currentPassword, password, ...otherUpdates } = req.body;

    try {
        // Find the user by id
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if the given password matches the user's password
        if (password) {
            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: 'Invalid current password' });
            }
            otherUpdates.password = await bcrypt.hash(password, 12);
        }

        // Update the user with the given data
        const updatedUser = await User.findByIdAndUpdate(id, otherUpdates, { new: true });

        // Generate a new JSON Web Token for the updated user
        const token = generateToken(updatedUser);

        // Return the updated user and the new token
        res.status(200).json({ user: updatedUser, token });
    } catch (error) {
        console.error("updateUser() - Error: ", error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

/**
 * Deletes a user from the database
 * 
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * 
 * @return {Promise<void>}
 */
export async function deleteUser(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });  
        }

        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

/**
 * Forgot password endpoint
 * 
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * 
 * @return {Promise<void>}
 */
export async function forgotPassword(req, res) {
    const { email } = req.body;
    try {
        // Find the user with the given email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a token of reset
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 ora

        // Save the token and its expiration in the database
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // Send the email with the link of reset
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


/**
 * Returns the reset password page if the token is valid and not expired.
 * 
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * 
 * @return {Promise<void>}
 */
export async function getResetPasswordPage(req, res) {

    const { token } = req.params;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // token not expired
        });

        if (!user) {
            console.log("User not found or token is invalid or expired");
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }   

        // Render the reset password page with the token
        res.status(200).render('reset-password', { token });
    } catch (error) {
        console.error("Error occurred during password reset:", error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
}


/**
 * Resets the password of a user using a valid reset token.
 * 
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * 
 * @return {Promise<void>}
 */
export async function resetPassword(req, res) {

    const { token, password } = req.body;

    try {
        // Find the user with the given reset token
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) {
            console.log("User not found or token is invalid or expired");
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update the user with the new password
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

/**
 * Gets all the shipping addresses for the given user.
 * 
 * @param {Object} req The Express request object.
 * @param {Object} res The Express response object.
 * 
 * @return {Promise<void>}
 */
export const getShippingAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).send('User not found');

        res.status(200).json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * Adds a new shipping address to the given user.
 * 
 * @param {Object} req The Express request object.
 * @param {Object} res The Express response object.
 * 
 * @return {Promise<void>}
 */
export const addShippingAddress = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).send('User not found');

        // Add the new address to the user's addresses array
        user.addresses.push(req.body);

        await user.save();

        res.status(201).json(user.addresses[user.addresses.length - 1]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Returns the payment methods of the given user.
 * 
 * @param {Object} req The Express request object.
 * @param {Object} res The Express response object.
 * 
 * @return {Promise<void>}
 */
export const getPaymentMethods = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).json(user.paymentMethods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * Adds a new payment method to the given user.
 * 
 * @param {Object} req The Express request object.
 * @param {Object} res The Express response object.
 * 
 * @return {Promise<void>}
 */
export const addPaymentMethod = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Add the new payment method to the user's paymentMethods array
        user.paymentMethods.push(req.body);

        await user.save();

        res.status(201).json(user.paymentMethods[user.paymentMethods.length - 1]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/**
 * Deletes a shipping address from the given user.
 * 
 * @param {Object} req The Express request object.
 * @param {Object} res The Express response object.
 * 
 * @return {Promise<void>}
 */
export async function deleteShippingAddress(req, res) {
    const { id, addressId } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Filter the addresses array to remove the specified address
        user.addresses = user.addresses.filter(address => address._id.toString() !== addressId);

        await user.save();

        res.status(200).json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}


/**
 * Updates a payment method for the given user.
 * 
 * @param {Object} req The Express request object.
 * @param {Object} res The Express response object.
 * 
 * @return {Promise<void>}
 */
export async function updatePaymentMethod(req, res) {
    const { id, paymentMethodId } = req.params;
    const { cardType, last4Digits, expiryDate, isDefault } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Find the payment method to be updated
        const paymentMethod = user.paymentMethods.id(paymentMethodId);
        if (!paymentMethod) return res.status(404).json({ message: 'Payment method not found' });

        // Set the payment method to be updated
        if (isDefault) {
            // If the payment method is to be set as default, set all other payment methods to false
            user.paymentMethods.forEach(pm => pm.isDefault = false);
        }

        // Update the payment method
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

/**
 * Deletes a payment method for the given user.
 * 
 * @param {Object} req The Express request object.
 * @param {Object} res The Express response object.
 * 
 * @return {Promise<void>}
 */
export async function deletePaymentMethod(req, res) {
    const { id, paymentMethodId } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Remove the payment method from the user's paymentMethods array
        user.paymentMethods = user.paymentMethods.filter(pm => pm._id.toString() !== paymentMethodId);

        await user.save();

        res.status(200).json(user.paymentMethods);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}



