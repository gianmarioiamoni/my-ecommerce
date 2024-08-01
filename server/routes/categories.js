import express from 'express';

import { getAllCategories, createCategory, deleteCategory, updateCategory } from '../controllers/categories.js';

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', createCategory); 
router.delete('/:name', deleteCategory);
router.put('/:name', updateCategory);

export default router;