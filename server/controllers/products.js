import Product from '../models/Product.js';

// Ottenere tutti i prodotti
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Creare un nuovo prodotto
export const createProduct = async (req, res) => {
    const product = req.body;

    const newProduct = new Product(product);

    try {
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// Ottenere un singolo prodotto
export const getProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Aggiornare un prodotto
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, imageUrl } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, { name, description, price, imageUrl }, { new: true });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// Cancellare un prodotto
export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        await Product.findByIdAndRemove(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
