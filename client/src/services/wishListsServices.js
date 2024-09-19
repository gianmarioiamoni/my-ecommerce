// wishListsServices.js
import axios from 'axios';

import serverURL from "../config/serverURL";

import { initAuthorizationHeader } from '../config/initAuthorizationHeader';

/**
 * Fetches the wishlists of the given user
 * @param {Object} user - The user to fetch the wishlists for
 * @return {Promise<Object>} The response from the server. If the request is successful, the response will contain the wishlists. If the request fails, the response will contain an error message.
 * @throws {Error} If there is an error fetching the wishlists
 */
export const getUserWishlists = async (user) => {
    try {
        initAuthorizationHeader();
        const response = await axios.get(`${serverURL}/wishlists`, { user });
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};


/**
 * Creates a new wishlist for the current user
 * @param {string} wishlistName - The name of the wishlist to create
 * @return {Promise<Object>} The response from the server. If the request is successful, the response will contain the wishlist data. If the request fails, the response will contain an error message.
 * @throws {Error} If there is an error creating the wishlist
 */
export const createWishlist = async (wishlistName) => {
    try {
        initAuthorizationHeader();
        const response = await axios.post(`${serverURL}/wishlists`, { name: wishlistName });
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};

/**
 * Adds a product to a wishlist
 * @param {string} wishlistId - The id of the wishlist to add the product to
 * @param {string} productId - The id of the product to add
 * @return {Promise<Object>} The response from the server. If the request is successful, the response will contain the updated wishlist data. If the request fails, the response will contain an error message.
 * @throws {Error} If there is an error adding the product to the wishlist
 */
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

/**
 * Removes a product from a wishlist
 * @param {string} wishlistId - The id of the wishlist to remove the product from
 * @param {string} productId - The id of the product to remove
 * @return {Promise<Object>} The response from the server. If the request is successful, the response will contain the updated wishlist data. If the request fails, the response will contain an error message.
 * @throws {Error} If there is an error removing the product from the wishlist
 */
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


/**
 * Edits the name of a wishlist
 * @param {string} wishlistId - The id of the wishlist to edit
 * @param {string} name - The new name of the wishlist
 * @return {Promise<Object>} The response from the server. If the request is successful, the response will contain the updated wishlist data. If the request fails, the response will contain an error message.
 * @throws {Error} If there is an error editing the wishlist name
 */
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


/**
 * Deletes a wishlist
 * @param {string} wishlistId - The id of the wishlist to delete
 * @return {Promise<Object>} The response from the server. If the request is successful, the response will contain a success message. If the request fails, the response will contain an error message.
 * @throws {Error} If there is an error deleting the wishlist
 */
export const deleteWishlist = async (wishlistId) => {
    try {
        initAuthorizationHeader();
        const response = await axios.delete(`${serverURL}/wishlists/${wishlistId}`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

