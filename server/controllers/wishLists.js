// controllers/wishlistController.js
import Wishlist from '../models/WishList.js'; 

/**
 * Creates a new wishlist for the current user.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * 
 * @returns {Promise<void>}
 */
export const createWishlist = async (req, res) => {
    try {
        const { name } = req.body;
        const wishlist = new Wishlist({
            user: req.user.id, 
            name,
            products: [] 
        });

        await wishlist.save();
        res.status(201).json(wishlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Returns all the wishlists for the current user.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * 
 * @returns {Promise<void>}
 */
export const getUserWishlists = async (req, res) => {
    const { user } = req.body;
    if (user && user.id !== req.user.id) {
        // If the user in the request body is not the current user, return an unauthorized error.
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        // Find all the wishlists for the current user and populate the products.
        const wishlists = await Wishlist.find({ user: req.user.id }).populate('products');
        res.status(200).json(wishlists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Gets a wishlist by ID and returns it in the response.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * 
 * @returns {Promise<void>}
 */
export const getWishlistById = async (req, res) => {
    try {
        // Find the wishlist by ID and populate the products.
        const wishlist = await Wishlist.findById(req.params.id).populate('products');

        if (!wishlist || wishlist.user.toString() !== req.user.id) {
            return res.status(404).json({ error: 'Wishlist not found' });
        }

        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Updates a wishlist by ID and returns the updated wishlist in the response.
 * 
 * The request body should contain the updated values for the wishlist.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * 
 * @returns {Promise<void>}
 */
export const updateWishlist = async (req, res) => {
    try {
        // Get the wishlist by ID and populate the products.
        const { name, products } = req.body;
        let wishlist = await Wishlist.findById(req.params.id).populate('products');

        if (!wishlist || wishlist.user.toString() !== req.user.id) {
            // If the wishlist is not found or the current user is not the owner, return a 404 error.
            return res.status(404).json({ error: 'Wishlist not found' });
        }

        // Update the wishlist with the new values from the request body.
        if (name) wishlist.name = name;
        if (products) wishlist.products = [...products];

        await wishlist.save();

        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Deletes a wishlist by ID and returns a success message in the response.
 * 
 * Only the owner of the wishlist can delete it.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * 
 * @returns {Promise<void>}
 */
export const deleteWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findById(req.params.id);

        if (!wishlist) {
            return res.status(404).json({ error: 'Wishlist not found' });
        }

        // Check if the user is authorized to delete the wishlist.
        if (wishlist.user.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Unauthorized to delete the wishlist' });
        }
        await Wishlist.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Wishlist deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
