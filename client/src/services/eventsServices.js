// src/services/eventService.js
import axios from 'axios';

import serverURL from '../config/serverURL';
import { initAuthorizationHeader } from '../config/initAuthorizationHeader';

export const getEvents = async (startDate, endDate) => {
    try {
        const response = await axios.get(`${serverURL}/events`, initAuthorizationHeader(), {
            params: { startDate, endDate }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
};

export const trackEvent = async (eventType, productId, metadata) => {
    try {
        initAuthorizationHeader();
        const response = await axios.post(`${serverURL}/events`, {
            userId: localStorage.getItem('userId'), // Assuming you have the user ID in localStorage
            eventType,
            productId,
            metadata,
        });
        return response.data;
    } catch (error) {
        console.error('Error tracking event:', error);
    } 

};
