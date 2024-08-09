import axios from "axios";

import serverURL from "../config/serverURL";


export const loginUser = async (userData) => {
    try {
        console.log(`Sending POST request to ${serverURL}/users/login`);
        const response = await axios.post(`${serverURL}/users/login`, userData);
        console.log("Received response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
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

export const updateUser = async (userId, userData) => {
    try {
        const response = await axios.put(`${serverURL}/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}



export const removeUser = async (userId) => {
    try {
        const response = await axios.delete(`${serverURL}/users/${userId}`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

export const uploadProfilePicture = async (formData) => {
    try {
        const response = await axios.post(`${serverURL}/uploadProfilePicture`, formData);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

