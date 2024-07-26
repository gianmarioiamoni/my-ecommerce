import axios from "axios";

import serverURL from "../config/serverURL";


export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${serverURL}/users/login`, userData);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}


export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${serverURL}/users/register`, userData);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}