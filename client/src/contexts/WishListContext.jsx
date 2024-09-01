import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserWishlists, createWishlist, addToWishlist, removeFromWishlist } from '../services/wishListsServices';
import { AuthContext } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [wishlists, setWishlists] = useState([]);

    useEffect(() => {
        if (user) {
            fetchWishlists();
        }
    }, [user]);

    const fetchWishlists = async () => {
        if (user) {
            const userWishlists = await getUserWishlists();
            setWishlists(userWishlists);
        }
    };

    const handleCreateWishlist = async (name) => {
        const newWishlist = await createWishlist(name);
        setWishlists([...wishlists, newWishlist]);
    };

    const handleAddToWishlist = async (wishlistId, productId) => {
        const updatedWishlist = await addToWishlist(wishlistId, productId);
        setWishlists(wishlists.map(w => w._id === wishlistId ? updatedWishlist : w));
    };

    const handleRemoveFromWishlist = async (wishlistId, productId) => {
        const updatedWishlist = await removeFromWishlist(wishlistId, productId);
        setWishlists(wishlists.map(w => w._id === wishlistId ? updatedWishlist : w));
    };

    return (
        <WishlistContext.Provider value={{
            wishlists,
            handleCreateWishlist,
            handleAddToWishlist,
            handleRemoveFromWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
