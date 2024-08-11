import express from 'express';
// import path from 'path';

import { registerUser, loginUser, updateUser, deleteUser, forgotPassword, resetPassword, getResetPasswordPage } from '../controllers/users.js';


const router = express.Router();

// Register route
router.post('/register', registerUser)

// Login route
router.post('/login', loginUser);

// Update route
router.put('/:id', updateUser);

// Delete route
router.delete('/:id', deleteUser);

// Password reset route
// router.post('/forgot-password', forgotPassword);

// router.get('/reset-password/:token', getResetPasswordPage);
// router.post('/reset-password/:token', resetPassword);


export default router;
