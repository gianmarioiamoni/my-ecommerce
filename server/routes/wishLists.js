// routes/wishlistRoutes.js
import express from 'express';
import {
    createWishlist,
    getUserWishlists,
    getWishlistById,
    updateWishlist,
    deleteWishlist,
} from '../controllers/wishLists.js';

import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .post(isAuthenticated, createWishlist)  
    .get(isAuthenticated, getUserWishlists); 

router.route('/:id')
    .get(isAuthenticated, getWishlistById)   
    .put(isAuthenticated, updateWishlist)    
    .delete(isAuthenticated, deleteWishlist); 


export default router;
