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

const router = express.Router();

router.get('/', getAllUsers);

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

router.get('/:id/addresses', getShippingAddresses);
router.post('/:id/addresses', addShippingAddress);
router.delete('/:id/addresses/:addressId', deleteShippingAddress);

router.get('/:id/payment-methods', getPaymentMethods);
router.post('/:id/payment-methods', addPaymentMethod);
router.delete('/:id/payment-methods/:paymentMethodId', deletePaymentMethod);

export default router;

