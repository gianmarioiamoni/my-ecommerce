import express from 'express';

import { isAuthenticated, isAdmin } from '../middleware/auth.js';

import { getWeeklySales, getMonthlySales, getQuarterlySales, getYearlySales } from '../controllers/statistics.js';

const router = express.Router();

router.get('/sales/weekly', isAuthenticated, isAdmin, getWeeklySales);
router.get('/sales/monthly', isAuthenticated, isAdmin, getMonthlySales);
router.get('/sales/quarterly', isAuthenticated, isAdmin, getQuarterlySales);
router.get('/sales/yearly', isAuthenticated, isAdmin, getYearlySales);

export default router;