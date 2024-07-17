import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import mongoose from 'mongoose';

import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';


const DB_NAME = 'my-ecommerce';

dotenv.config();

const CONNECTION_URL = process.env.MONGO_DB || 'mongodb://localhost:27017';
console.log(CONNECTION_URL, DB_NAME);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

// routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

const connectDB = async () => {
    try {
        await mongoose.connect(CONNECTION_URL, {dbName: DB_NAME});
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error);
    }
};

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
