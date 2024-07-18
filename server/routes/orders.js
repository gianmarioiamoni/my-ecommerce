import express from 'express';
import { createOrder, captureOrder } from '../controllers/orders.js';

const router = express.Router();

router.post('/create', createOrder);
router.post('/capture', captureOrder);

export default router;
