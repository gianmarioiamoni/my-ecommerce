import express from 'express';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

import { approveReview, getProductUserReview, updateReview, createReview, getProductReviews } from '../controllers/reviews.js';

const router = express.Router();


router.get('/product/:productId', getProductReviews);
router.get('/user-review/:productId/:userId', isAuthenticated, getProductUserReview);

router.post('/product/:productId', isAuthenticated, createReview);

router.put('/:reviewId', isAuthenticated, updateReview);
router.put('/:reviewId/approve', isAuthenticated, isAdmin, approveReview);



export default router;
