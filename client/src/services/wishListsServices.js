// wishListsServices.js
import axios from 'axios';

import serverURL from "../config/serverURL";

import { initAuthorizationHeader } from '../config/initAuthorizationHeader';

export const getUserWishlists = async (user) => {
    try {
        initAuthorizationHeader();
        const response = await axios.get(`${serverURL}/wishlists`, { user });
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};


export const createWishlist = async (wishlistName) => {
    try {
        initAuthorizationHeader();
        const response = await axios.post(`${serverURL}/wishlists`, { name: wishlistName });
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};

export const addToWishlist = async (wishlistId, productId) => {
    try {
        initAuthorizationHeader();
        // get wishlist
        const wishlist = await axios.get(`${serverURL}/wishlists/${wishlistId}`);
        // add product to wishlist product array
        const products = [...wishlist.data.products, productId];
        // update wishlist
        const response = await axios.put(`${serverURL}/wishlists/${wishlistId}`, { products });
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};

export const removeFromWishlist = async (wishlistId, productId) => {
    try {
        initAuthorizationHeader();
        // get wishlist
        const wishlist = await axios.get(`${serverURL}/wishlists/${wishlistId}`);
        // remove product from wishlist product array
        const products = wishlist.data.products.filter(p => p._id !== productId);
        // remove from wishlist object the items with products with _id !== productId
        const filteredWishlist = { ...wishlist.data, products };
        // update wishlist
        await axios.put(`${serverURL}/wishlists/${wishlistId}`, { products });
        return filteredWishlist;
    } catch (error) {
        return { error: error.response.data.error };
    }
};


export const editWishlistName = async (wishlistId, name) => {
    try {
        initAuthorizationHeader();
        // update wishlist with new name
        const response = await axios.put(`${serverURL}/wishlists/${wishlistId}`, { name });
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}


export const deleteWishlist = async (wishlistId) => {
    try {
        initAuthorizationHeader();
        const response = await axios.delete(`${serverURL}/wishlists/${wishlistId}`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

