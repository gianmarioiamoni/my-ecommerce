import express from 'express';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

import { approveReview, getProductUserReview, updateReview } from '../controllers/reviews.js';

const router = express.Router();


router.put('/:reviewId', isAuthenticated, updateReview);
router.put('/:reviewId/approve', isAuthenticated, isAdmin, approveReview);

router.get('/user-review/:productId/:userId', isAuthenticated, getProductUserReview);


export default router;
