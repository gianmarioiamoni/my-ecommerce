import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import mongoose from 'mongoose';

import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';

import fs from 'fs';
import https from 'https';

import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';


const DB_NAME = 'my-ecommerce';

dotenv.config();

const CONNECTION_URL = process.env.MONGO_DB || 'mongodb://localhost:27017';
console.log(CONNECTION_URL, DB_NAME);

const app = express();
const PORT = process.env.PORT || 5000;


const httpsOptions = {
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost.pem')
};


const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
    cloud_name: 'dzmynvqbz',
    api_key: '412115921995178',
    api_secret: 'WPU6mpihkcxw54I96u2-3h9EIP0'
});

app.use(cors());

app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

app.post('/upload', upload.single('file'), (req, res) => {
    cloudinary.uploader.upload_stream({ folder: 'my_ecommerce' }, (error, result) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).send({ url: result.secure_url });
    }).end(req.file.buffer);
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

https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});
