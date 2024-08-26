import axios from 'axios';
import serverURL from '../config/serverURL';


export const submitReview = async (productId, review) => {
    try {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        const response = await axios.post(`${serverURL}/products/${productId}/reviews`, review, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        // Throw the error message from the server to enable a more detailed error handling in the frontend React component 
        throw error.response ? error.response.data : new Error("Server Error");
    }
};

export const getProductReviews = async (productId) => {
    try {
        const token = localStorage.getItem('token');  //Retrieve the token from local storage 
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
