import express from 'express';
import multer from 'multer';

import { v2 as cloudinary } from 'cloudinary';

import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });


router.post('/upload', isAuthenticated, isAdmin, upload.single('file'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload_stream((error, result) => {
            if (error) {
                return res.status(500).send(error);
            }
            res.status(200).send({ url: result.secure_url });
        });
        req.file.stream.pipe(result);
    } catch (error) {
        res.status(500).send({ error: 'Image upload failed' });
    }
});

router.post('/uploadProfilePicture', isAuthenticated, upload.single('file'), async (req, res) => {
    try {
        const stream = await cloudinary.uploader.upload_stream((error, result) => {
            if (error) {
                return res.status(500).send(error);
            }
            res.status(200).send({ url: result.secure_url });
        });
        req.file.stream.pipe(stream);
    } catch (error) {
        res.status(500).send({ error: 'Profile picture upload failed' });
    }
});

export default router;