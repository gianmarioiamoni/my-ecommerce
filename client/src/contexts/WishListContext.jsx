import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserWishlists, createWishlist, addToWishlist, removeFromWishlist, editWishlistName, deleteWishlist } from '../services/wishListsServices';
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
    }, [user, wishlists.length]);

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
        return newWishlist;
    };

    const handleAddToWishlist = async (wishlistId, productId) => {
        console.log('Adding product to wishlist:', wishlistId, productId);
        const updatedWishlist = await addToWishlist(wishlistId, productId);
        console.log('Updated wishlist:', updatedWishlist);
        // setWishlists(wishlists.map(w => w._id === wishlistId ? updatedWishlist : w));
        setWishlists((prevWishlists) =>
            prevWishlists.map((wishlist) =>
                wishlist._id === wishlistId
                    ? { ...wishlist, products: [...wishlist.products, productId] }
                    : wishlist
            )
        );
    };

    const handleRemoveFromWishlist = async (wishlistId, productId) => {
        console.log('Removing product from wishlist:', wishlistId, productId);
        const updatedWishlist = await removeFromWishlist(wishlistId, productId);
        console.log('Updated wishlist:', updatedWishlist);
        // setWishlists(wishlists.map(w => w._id === wishlistId ? updatedWishlist : w));
        setWishlists((prevWishlists) =>
            prevWishlists.map((wishlist) =>
                wishlist._id === wishlistId
                    ? { ...wishlist, products: wishlist.products.filter((id) => id !== productId) }
                    : wishlist
            )
        );
    };

    const handleEditWishlistName = async (wishlistId, name) => {
        console.log('Editing wishlist name:', wishlistId, name);
        const updatedWishlist = await editWishlistName(wishlistId, name);
        console.log('Updated wishlist:', updatedWishlist);
        setWishlists(wishlists.map(w => w._id === wishlistId ? updatedWishlist : w));
    };

    const handleDeleteWishlist = async (wishlistId) => {
        try {
            await deleteWishlist(wishlistId);
            console.log('Wishlist deleted');
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
