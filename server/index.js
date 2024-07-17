import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import mongoose from 'mongoose';

import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';

const CONNECTION_URL = process.env.MONGO_DB || 'mongodb://localhost:27017';
const DB_NAME = 'my-ecommerce';

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
