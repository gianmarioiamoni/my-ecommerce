import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserWishlists, createWishlist, addToWishlist, removeFromWishlist, editWishlistName } from '../services/wishListsServices';
import { AuthContext } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [wishlists, setWishlists] = useState([]);

    useEffect(() => {
        if (user) {
            console.log('Fetching wishlists for user:', user);
            fetchWishlists(user);
        }
    }, [user]);

    const fetchWishlists = async () => {
        if (user) {
            console.log('Getting user wishlists...');
            const userWishlists = await getUserWishlists(user);
            console.log('User wishlists:', userWishlists);
            setWishlists(userWishlists);
        }
    };

    const handleCreateWishlist = async (name) => {
        console.log('Creating wishlist:', name);
        const newWishlist = await createWishlist(name);
        console.log('New wishlist:', newWishlist);
        setWishlists([...wishlists, newWishlist]);
    };

    const handleAddToWishlist = async (wishlistId, productId) => {
        console.log('Adding product to wishlist:', wishlistId, productId);
        const updatedWishlist = await addToWishlist(wishlistId, productId);
        console.log('Updated wishlist:', updatedWishlist);
        setWishlists(wishlists.map(w => w._id === wishlistId ? updatedWishlist : w));
    };

    const handleRemoveFromWishlist = async (wishlistId, productId) => {
        console.log('Removing product from wishlist:', wishlistId, productId);
        const updatedWishlist = await removeFromWishlist(wishlistId, productId);
        console.log('Updated wishlist:', updatedWishlist);
        setWishlists(wishlists.map(w => w._id === wishlistId ? updatedWishlist : w));
    };

    const handleEditWishlistName = async (wishlistId, name) => {
        console.log('Editing wishlist name:', wishlistId, name);
        const updatedWishlist = await editWishlistName(wishlistId, name);
        console.log('Updated wishlist:', updatedWishlist);
        setWishlists(wishlists.map(w => w._id === wishlistId ? updatedWishlist : w));
    };

    return (
        <WishlistContext.Provider value={{
            wishlists,
            handleCreateWishlist,
            handleAddToWishlist,
            handleRemoveFromWishlist,
            handleEditWishlistName
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
