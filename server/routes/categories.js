import express from 'express';

import { getAllCategories, createCategory, deleteCategory, updateCategory } from '../controllers/categories.js';

import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', isAuthenticated, isAdmin,createCategory); 
router.delete('/:name', isAuthenticated, isAdmin, deleteCategory);
router.put('/:name', isAuthenticated, isAdmin, updateCategory);

export default router;