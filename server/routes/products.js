import express from 'express';

import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductReviews, createReview } from '../controllers/products.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', isAuthenticated, isAdmin, createProduct);
router.patch('/:id', isAuthenticated, isAdmin, updateProduct);
router.delete('/:id', isAuthenticated, isAdmin, deleteProduct);

router.post('/:productId/reviews', isAuthenticated, createReview);
router.get('/:productId/reviews', isAuthenticated, getProductReviews);


export default router;
