import { v2 as cloudinary } from 'cloudinary';

// Configurazione di Cloudinary
cloudinary.config({
    // cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    // api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
    // api_secret: import.meta.env.VITE_CLOUDINARY_SECRET
    cloud_name: 'dzmynvqbz',
    api_key: '412115921995178',
    api_secret: 'WPU6mpihkcxw54I96u2-3h9EIP0'
});

export default cloudinary;
