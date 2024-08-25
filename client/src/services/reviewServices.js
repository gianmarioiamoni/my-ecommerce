import axios from 'axios';
import serverURL from '../config/serverURL';
// import { getAuthToken } from './authServices'; // Funzione che recupera il token, che puoi implementare

export const submitReview = async (productId, review) => {
    try {
        const token = localStorage.getItem('token'); // Recupera il token JWT
        const response = await axios.post(`${serverURL}/products/${productId}/reviews`, review, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const getProductReviews = async (productId) => {
    try {
        const token = localStorage.getItem('token');  // Recupera il token JWT
        const response = await axios.get(`${serverURL}/products/${productId}/reviews`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
