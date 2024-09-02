// controllers/wishlistController.js
import Wishlist from '../models/WishList.js'; 

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

export const getUserWishlists = async (req, res) => {
    const { user } = req.body;
    if (user && user.id !== req.user.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const wishlists = await Wishlist.find({ user: req.user.id }).populate('products');
        res.status(200).json(wishlists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getWishlistById = async (req, res) => {
    try {
        const wishlist = await Wishlist.findById(req.params.id).populate('products');

        if (!wishlist || wishlist.user.toString() !== req.user.id) {
            return res.status(404).json({ error: 'Wishlist not found' });
        }

        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateWishlist = async (req, res) => {
    try {
        const { name, products } = req.body;
        let wishlist = await Wishlist.findById(req.params.id).populate('products');

        if (!wishlist || wishlist.user.toString() !== req.user.id) {
            return res.status(404).json({ error: 'Wishlist not found' });
        }

        if (name) wishlist.name = name;
        if (products) wishlist.products = [...products];

        await wishlist.save();
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findById(req.params.id);

        if (!wishlist || wishlist.user.toString() !== req.user.id) {
            return res.status(404).json({ error: 'Wishlist not found' });
        }

        await wishlist.remove();
        res.status(200).json({ message: 'Wishlist deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
