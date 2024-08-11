import express from 'express';
import {
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    addShippingAddress,
    updateShippingAddress,
    deleteShippingAddress,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod
} from '../controllers/users.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

router.post('/:id/addresses', addShippingAddress);
router.put('/:id/addresses/:addressId', updateShippingAddress);
router.delete('/:id/addresses/:addressId', deleteShippingAddress);

router.post('/:id/payment-methods', addPaymentMethod);
router.put('/:id/payment-methods/:paymentMethodId', updatePaymentMethod);
router.delete('/:id/payment-methods/:paymentMethodId', deletePaymentMethod);

export default router;

