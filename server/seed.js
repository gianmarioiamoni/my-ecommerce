import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import Review from './models/Review.js';
import Wishlist from './models/WishList.js';
import Order from './models/Order.js';
import Category from './models/Category.js';

import dotenv from 'dotenv';

const DB_NAME = 'my-ecommerce';

dotenv.config();

const CONNECTION_URL = process.env.MONGO_DB || 'mongodb://localhost:27017';
console.log("CONNECTION_URL:", CONNECTION_URL);

// Connessione al database
const connectDB = async () => {
    try {
        await mongoose.connect(CONNECTION_URL, {dbName: DB_NAME});
        console.log('MongoDB connesso!');
    } catch (error) {
        console.error('Errore di connessione:', error.message);
        process.exit(1);
    }
};

// Funzione di seed
const seedDB = async () => {
    try {
        // Cancella le collezioni esistenti
        await Product.deleteMany({});
        await Review.deleteMany({});
        await Wishlist.deleteMany({});
        await Order.deleteMany({});
        await Category.deleteMany({});

        // Categorie di esempio
        const categories = await Category.insertMany([
            { name: 'Skincare' },
            { name: 'Haircare' },
            { name: 'Makeup' },
            { name: 'Fragrance' },
            { name: 'Body Care' },
        ]);

        // Prodotti di esempio
        const products = await Product.insertMany([
            {
                name: 'Hydrating Face Cream',
                description: 'A lightweight cream that hydrates and revitalizes skin.',
                price: 29.99,
                imageUrls: [
                    'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.myntra.com%2Fface-cream&psig=AOvVaw0uJGTZNMCHImzvFtbJp-9Y&ust=1726695952163000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMio1oH6yogDFQAAAAAdAAAAABAE',
                    'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.dotandkey.com%2Fcollections%2Fmoisturizers&psig=AOvVaw0uJGTZNMCHImzvFtbJp-9Y&ust=1726695952163000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMio1oH6yogDFQAAAAAdAAAAABAJ',
                    'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.amazon.in%2FCeramides-Moisturizer-Hyaluronic-Moisturizing-Strengthening%2Fdp%2FB0D4YSFKLC&psig=AOvVaw0uJGTZNMCHImzvFtbJp-9Y&ust=1726695952163000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMio1oH6yogDFQAAAAAdAAAAABAT'
                ],
                availability: 'In Stock',
                category: categories[0]._id, // Skincare
                quantity: 100,
                averageRating: 4.5,
                reviewCount: 2,
            },
            {
                name: 'Nourishing Hair Oil',
                description: 'A blend of natural oils that nourishes and strengthens hair.',
                price: 19.99,
                imageUrls: ['https://example.com/nourishing-hair-oil.jpg'],
                availability: 'In Stock',
                category: categories[1]._id, // Haircare
                quantity: 150,
                averageRating: 4.2,
                reviewCount: 1,
            },
            {
                name: 'Matte Lipstick',
                description: 'Long-lasting matte lipstick available in multiple shades.',
                price: 14.99,
                imageUrls: ['https://example.com/matte-lipstick.jpg'],
                availability: 'In Stock',
                category: categories[2]._id, // Makeup
                quantity: 200,
                averageRating: 4.7,
                reviewCount: 3,
            },
            {
                name: 'Anti-Aging Serum',
                description: 'Serum formulated to reduce wrinkles and fine lines.',
                price: 49.99,
                imageUrls: ['https://example.com/anti-aging-serum.jpg'],
                availability: 'In Stock',
                category: categories[0]._id, // Skincare
                quantity: 80,
                averageRating: 4.8,
                reviewCount: 5,
            },
            {
                name: 'Soothing Body Lotion',
                description: 'A calming lotion for dry and sensitive skin.',
                price: 24.99,
                imageUrls: ['https://example.com/soothing-body-lotion.jpg'],
                availability: 'In Stock',
                category: categories[4]._id, // Body Care
                quantity: 120,
                averageRating: 4.4,
                reviewCount: 2,
            },
            {
                name: 'Refreshing Body Wash',
                description: 'An invigorating body wash that cleanses and refreshes the skin.',
                price: 12.99,
                imageUrls: ['https://example.com/refreshing-body-wash.jpg'],
                availability: 'In Stock',
                category: categories[4]._id, // Body Care
                quantity: 100,
                averageRating: 4.3,
                reviewCount: 3,
            },
            {
                name: 'Rose Perfume',
                description: 'A floral fragrance with notes of fresh roses and jasmine.',
                price: 59.99,
                imageUrls: ['https://example.com/rose-perfume.jpg'],
                availability: 'In Stock',
                category: categories[3]._id, // Fragrance
                quantity: 50,
                averageRating: 4.9,
                reviewCount: 4,
            },
            {
                name: 'Volumizing Hair Mousse',
                description: 'A mousse that adds volume and shine to your hair.',
                price: 16.99,
                imageUrls: ['https://example.com/volumizing-hair-mousse.jpg'],
                availability: 'In Stock',
                category: categories[1]._id, // Haircare
                quantity: 180,
                averageRating: 4.6,
                reviewCount: 2,
            }
        ]);

        // Recensioni di esempio
        const reviews = await Review.insertMany([
            {
                productId: products[0]._id, // Hydrating Face Cream
                userId: '66b106747a4870e54b3eb4b5', // Gianmario Iamoni
                rating: 5,
                comment: 'Amazing product! My skin feels so soft.',
            },
            {
                productId: products[0]._id, // Hydrating Face Cream
                userId: '66bf93b162257760831b7c11', // Admin
                rating: 4,
                comment: 'Good cream, but a bit pricey.',
            },
            {
                productId: products[2]._id, // Matte Lipstick
                userId: '66b106747a4870e54b3eb4b5', // Gianmario Iamoni
                rating: 5,
                comment: 'Love the color! It lasts all day.',
            },
            {
                productId: products[2]._id, // Matte Lipstick
                userId: '66bf93b162257760831b7c11', // Admin
                rating: 4,
                comment: 'Beautiful shade, but dries out my lips a bit.',
            },
            {
                productId: products[3]._id, // Anti-Aging Serum
                userId: '66b106747a4870e54b3eb4b5', // Gianmario Iamoni
                rating: 5,
                comment: 'I noticed a difference in just a week!',
            },
            {
                productId: products[4]._id, // Soothing Body Lotion
                userId: '66bf93b162257760831b7c11', // Admin
                rating: 4,
                comment: 'Really helps with dry skin, but the scent is a bit strong.',
            },
            {
                productId: products[5]._id, // Refreshing Body Wash
                userId: '66b106747a4870e54b3eb4b5', // Gianmario Iamoni
                rating: 5,
                comment: 'Love the refreshing scent!',
            },
            {
                productId: products[7]._id, // Volumizing Hair Mousse
                userId: '66bf93b162257760831b7c11', // Admin
                rating: 4,
                comment: 'Adds great volume, but leaves some residue.',
            },
        ]);

        // Wishlist di esempio
        const wishlists = await Wishlist.insertMany([
            {
                user: '66b106747a4870e54b3eb4b5', // Gianmario Iamoni
                name: 'My Skincare Favorites',
                products: [products[0]._id, products[3]._id], // Hydrating Face Cream, Anti-Aging Serum
            },
            {
                user: '66bf93b162257760831b7c11', // Admin
                name: 'Admin Wishlist',
                products: [products[2]._id, products[7]._id], // Matte Lipstick, Volumizing Hair Mousse
            },
        ]);

        // Ordini di esempio
        const orders = await Order.insertMany([
            {
                userId: '66b106747a4870e54b3eb4b5', // Gianmario Iamoni
                products: [
                    {
                        product: products[0]._id, // Hydrating Face Cream
                        quantity: 1,
                    },
                    {
                        product: products[3]._id, // Anti-Aging Serum
                        quantity: 1,
                    },
                ],
                totalAmount: 79.98, // 29.99 + 49.99
                status: 'Delivered',
            },
            {
                userId: '66bf93b162257760831b7c11', // Admin
                products: [
                    {
                        product: products[2]._id, // Matte Lipstick
                        quantity: 2,
                    },
                    {
                        product: products[7]._id, // Volumizing Hair Mousse
                        quantity: 1,
                    },
                ],
                totalAmount: 46.97, // (14.99 * 2) + 16.99
                status: 'Shipped',
            },
        ]);

        console.log('Database seeded con successo!');
        process.exit();
    } catch (error) {
        console.error('Errore durante il seeding del database:', error);
        process.exit(1);
    }
};

// Avvia la connessione e il seeding
const startSeeding = async () => {
    try {
        await connectDB();
        await seedDB();
    } catch (error) {
        console.error('Errore: ', error);
        process.exit(1);
    }
}

startSeeding();
