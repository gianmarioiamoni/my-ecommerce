import express from 'express';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

import { approveReview } from '../controllers/reviews.js';

const router = express.Router();


router.put('/:reviewId/approve', isAuthenticated, isAdmin, approveReview);


export default router;
