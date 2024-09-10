import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserWishlists, createWishlist, addToWishlist, removeFromWishlist, editWishlistName, deleteWishlist } from '../services/wishListsServices';
import { AuthContext } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [wishlists, setWishlists] = useState([]);

    useEffect(() => {
        if (user) {
            fetchWishlists(user);
        }
    }, [user, wishlists.length]);

    const fetchWishlists = async () => {
        if (user) {
            const userWishlists = await getUserWishlists(user);
            setWishlists(userWishlists);
        }
    };

    const handleCreateWishlist = async (name) => {
        const newWishlist = await createWishlist(name);
        setWishlists([...wishlists, newWishlist]);
        return newWishlist;
    };

    const handleAddToWishlist = async (wishlistId, productId) => {
        const updatedWishlist = await addToWishlist(wishlistId, productId);
        setWishlists((prevWishlists) =>
            prevWishlists.map((wishlist) =>
                wishlist._id === wishlistId
                    ? { ...wishlist, products: [...wishlist.products, productId] }
                    : wishlist
            )
        );
    };

    const handleRemoveFromWishlist = async (wishlistId, productId) => {
        const updatedWishlist = await removeFromWishlist(wishlistId, productId);
        setWishlists((prevWishlists) =>
            prevWishlists.map((wishlist) =>
                wishlist._id === wishlistId
                    ? { ...wishlist, products: wishlist.products.filter((id) => id !== productId) }
                    : wishlist
            )
        );
    };

    const handleEditWishlistName = async (wishlistId, name) => {
        const updatedWishlist = await editWishlistName(wishlistId, name);
        setWishlists(wishlists.map(w => w._id === wishlistId ? updatedWishlist : w));
    };

    const handleDeleteWishlist = async (wishlistId) => {
        try {
            await deleteWishlist(wishlistId);
            setWishlists(wishlists.filter(w => w._id !== wishlistId));
        } catch (error) {
            console.error('Error deleting wishlist:', error);
        }
    };

    const isProductInAnyWishlist = (productId) => {
        // wishlist.products is an array of product objects, each with an _id property
        // check if the product is in any of the wishlist products
        return wishlists.some(wishlist => wishlist.products.some(p => p._id === productId));
    };

    return (
        <WishlistContext.Provider value={{
            wishlists,
            handleCreateWishlist,
            handleAddToWishlist,
            handleRemoveFromWishlist,
            handleEditWishlistName,
            handleDeleteWishlist,
            isProductInAnyWishlist,
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
