// src/services/eventService.js
import axios from 'axios';

import serverURL from '../config/serverURL';
import { initAuthorizationHeader } from '../config/initAuthorizationHeader';

/**
 * Fetches the events from the server for the given date range.
 * 
 * @param {string} startDate The start date of the range in ISO format
 * @param {string} endDate The end date of the range in ISO format
 * 
 * @throws {Error} If there is an error fetching the events
 * 
 * @returns {Promise<array>} The array of events
 */
export const getEvents = async (startDate, endDate) => {
    try {
        const response = await axios.get(`${serverURL}/events`, {
            ...initAuthorizationHeader(),
            params: { startDate, endDate } 
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
};

/**
 * Tracks an event on the server
 * 
 * @param {string} eventType The type of event to track
 * @param {string} productId The ID of the product related to the event
 * @param {string} userId The ID of the user who triggered the event
 * @param {Object} metadata Additional metadata about the event
 * 
 * @throws {Error} If there is an error tracking the event
 * 
 * @returns {Promise<Object>} The response from the server
 */
export const trackEvent = async (eventType, productId, userId, metadata) => {
    try {
        initAuthorizationHeader();
        const response = await axios.post(`${serverURL}/events`, {
            userId, 
            eventType,
            productId,
            metadata,
        });
        return response.data;
    } catch (error) {
        console.error('Error tracking event:', error);
        throw error; // Rethrow the error so the calling code can handle it
    } 
};
