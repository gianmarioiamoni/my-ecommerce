import express from 'express';
import {
    getAllUsers,
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    getShippingAddresses,
    addShippingAddress,
    deleteShippingAddress,
    getPaymentMethods,
    addPaymentMethod,
    deletePaymentMethod
} from '../controllers/users.js';

import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllUsers);

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/:id', isAuthenticated, updateUser);
router.delete('/:id', isAuthenticated, deleteUser);

router.get('/:id/addresses', isAuthenticated, getShippingAddresses);
router.post('/:id/addresses', isAuthenticated, addShippingAddress);
router.delete('/:id/addresses/:addressId', isAuthenticated, deleteShippingAddress);

router.get('/:id/payment-methods', isAuthenticated, getPaymentMethods);
router.post('/:id/payment-methods', isAuthenticated, addPaymentMethod);
router.delete('/:id/payment-methods/:paymentMethodId', isAuthenticated,deletePaymentMethod);

export default router;

