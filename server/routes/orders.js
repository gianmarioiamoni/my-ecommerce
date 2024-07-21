import express from 'express';
import { createOrder, captureOrder, handleOrder } from '../controllers/orders.js';

const router = express.Router();

// router.post('/create', createOrder);
router.post('/capture', captureOrder);
router.post('/', handleOrder);

export default router;
