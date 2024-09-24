import React, { createContext, useContext } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import {
    getUserWishlists,
    createWishlist,
    addToWishlist,
    removeFromWishlist,
    editWishlistName,
    deleteWishlist
} from '../services/wishListsServices';

import { AuthContext } from './AuthContext';

const WishlistContext = createContext();


/**
 * The WishlistProvider component provides the WishlistContext to its children.
 * It fetches the wishlists associated with the user from the server on mount,
 * and stores them in the state. It also provides functions to add, delete and
 * update wishlists, as well as to check if a product is in any wishlist.
 *
 * @param {ReactNode} children - The children of the component.
 * @returns {ReactElement} - The rendered component.
 */
export const WishlistProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    // const [wishlists, setWishlists] = useState([]);

    /**
     * Custom hook to fetch wishlists associated with the user.
     * The query is enabled only if the user is logged in.
     * The data is cached for 5 minutes.
     * @param {Object} user - The user object.
     * @returns {Object} - The result of the query.
     */
    const useFetchWishlists = (user) => {
        return useQuery(
            ['wishlists', user?.id], // The query key depends on the user ID
            async () => {
                if (!user) return []; // If there is no user, return an empty array
                // Fetch the wishlists associated with the user
                const userWishlists = await getUserWishlists(user);
                return userWishlists;
            },
            {
                enabled: !!user, // Disable the query if there is no logged user
                staleTime: 1000 * 60 * 5, // Data cache for 5 minutes
                onError: (error) => {
                    console.error("Error fetching wishlists:", error);
                }
            }
        );
    };

    const { data: wishlists, isLoading, error } = useFetchWishlists(user);

    /**
     * Creates a new wishlist with the given name.
     * Adds the new wishlist to the state.
     * @param {string} name - The name of the new wishlist.
     */
    const handleCreateWishlist = async (name) => {
        const newWishlist = await createWishlist(name);

        // Invalidate the query to fetch the updated wishlists
        queryClient.invalidateQueries('wishlists');

        return newWishlist;
    };


    /**
     * Adds a product to a wishlist.
     * Updates the state with the new wishlist.
     * @param {string} wishlistId - The ID of the wishlist to add the product to.
     * @param {string} productId - The ID of the product to add.
     */
    const handleAddToWishlist = async (wishlistId, productId) => {
        const updatedWishlist = await addToWishlist(wishlistId, productId);

        // Invalida e refetcha la query delle wishlist
        queryClient.invalidateQueries('wishlists');
    };


    /**
     * Removes a product from a wishlist.
     * Updates the state with the new wishlist.
     * @param {string} wishlistId - The ID of the wishlist to remove the product from.
     * @param {string} productId - The ID of the product to remove.
     */
    const handleRemoveFromWishlist = async (wishlistId, productId) => {
        const updatedWishlist = await removeFromWishlist(wishlistId, productId);

        queryClient.invalidateQueries('wishlists');
    };


    /**
     * Edits the name of a wishlist.
     * Updates the state with the new wishlist.
     * @param {string} wishlistId - The ID of the wishlist to edit.
     * @param {string} name - The new name for the wishlist.
     */
    const handleEditWishlistName = async (wishlistId, name) => {
        const updatedWishlist = await editWishlistName(wishlistId, name);

        queryClient.invalidateQueries('wishlists');
    };


    /**
     * Deletes a wishlist.
     * Updates the state by removing the wishlist.
     * @param {string} wishlistId - The ID of the wishlist to delete.
     */
    const handleDeleteWishlist = async (wishlistId) => {
        try {
            await deleteWishlist(wishlistId);

            queryClient.invalidateQueries('wishlists');
        } catch (error) {
            console.error('Error deleting wishlist:', error);
        }
    };


    /**
     * Checks if a product is in any wishlist.
     * @param {string} productId - The ID of the product to check.
     * @returns {boolean} - True if the product is in any wishlist, false otherwise.
     */
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
