import express from 'express';

import { registerUser, loginUser, updateUser, deleteUser } from '../controllers/users.js';


const router = express.Router();

// Register route
router.post('/register', registerUser)

// Login route
router.post('/login', loginUser);

// Update route
router.put('/:id', updateUser);

// Delete route
router.delete('/:id', deleteUser);

export default router;
