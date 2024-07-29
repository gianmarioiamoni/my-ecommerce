// import {v2 as cloudinary} from 'cloudinary';
import express from 'express';
import multer from 'multer';

import {v2 as cloudinary} from 'cloudinary';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });



// cloudinary.config({
//     cloud_name: 'dzmynvqbz',
//     api_key: '412115921995178',
//     api_secret: 'WPU6mpihkcxw54I96u2-3h9EIP0'
// });

router.post('/upload', upload.single('file'), async (req, res) => {
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

export default router;