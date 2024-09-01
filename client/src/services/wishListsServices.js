// wishListsServices.js
import axios from 'axios';

import { serverURL } from '../config/config';

import { initAuthorizationHeader } from '../config/initAuthorizationHeader';

export const getUserWishlists = async () => {
    try {
        initAuthorizationHeader();
        const response = await axios.get(`/${serverURL}/wishlists`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};


export const createWishlist = async (wishlistName) => {
    try {
        initAuthorizationHeader();
        const response = await axios.post(`/${serverURL}/wishlists`, { name: wishlistName });
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};

export const addToWishlist = async (wishlistId, productId) => {
    try {
        initAuthorizationHeader();
        const response = await axios.put(`/${serverURL}/wishlists/${wishlistId}`, { productId });
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};

export const removeFromWishlist = async (wishlistId, productId) => {
    try {
        initAuthorizationHeader();
        const response = await axios.put(`/${serverURL}/wishlists/${wishlistId}/product`, { productId });
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};

export const deleteWishlist = async (wishlistId) => {
    try {
        initAuthorizationHeader();
        const response = await axios.delete(`/${serverURL}/wishlists/${wishlistId}`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}