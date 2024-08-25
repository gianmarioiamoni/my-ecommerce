import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';

import mongoose from 'mongoose';

import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import categoryRoutes from './routes/categories.js';
import reviewRoutes from './routes/reviews.js';

import fs from 'fs';
import https from 'https';

import { v2 as cloudinary } from 'cloudinary';
    
import multer from 'multer';

import createAdminUser from './config/initAdmin.js';

import { getResetPasswordPage, resetPassword, forgotPassword } from './controllers/users.js';


const DB_NAME = 'my-ecommerce';

dotenv.config();

const CONNECTION_URL = process.env.MONGO_DB || 'mongodb://localhost:27017';
const serverURL = process.env.SERVER_URL || 'https://localhost:5000'; 

console.log(CONNECTION_URL, DB_NAME);
console.log(serverURL);

const app = express();
const PORT = process.env.PORT || 5000;

// Ottenere il percorso della directory corrente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configura il percorso corretto per la cartella dist
const clientBuildPath = path.join(__dirname, '../client/dist');


const httpsOptions = {
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost.pem')
};


const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


app.use(cors());

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

app.post(`/api/upload`, upload.single('file'), (req, res) => {
    cloudinary.uploader.upload_stream({ folder: 'my_ecommerce' }, (error, result) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).send({ url: result.secure_url });
    }).end(req.file.buffer);
});

app.post('/api/uploadProfilePicture', upload.single('file'), (req, res) => {
    cloudinary.uploader.upload_stream({ folder: 'my_ecommerce' }, (error, result) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).send({ url: result.secure_url });
    }).end(req.file.buffer);
});

app.post('/api/forgot-password', forgotPassword);

app.get('/api/reset-password/:token', getResetPasswordPage);
app.post('/api/reset-password', resetPassword);

// routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/categories', categoryRoutes);
app.use('/reviews', reviewRoutes);


// Serving static files from client/dist
app.use(express.static(clientBuildPath));

// Manage 404 errors and render index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

const connectDB = async () => {
    try {
        await mongoose.connect(CONNECTION_URL, {dbName: DB_NAME});
        console.log('MongoDB connected');
        createAdminUser();
    } catch (error) {
        console.log(error);
    }
};

connectDB();

https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});