import axios from "axios";

import serverURL from "../config/serverURL";
import { initAuthorizationHeader } from "../config/initAuthorizationHeader";

/**
 * Fetches the weekly sales data from the server
 * @returns {Promise<Object>} The sales data for the week
 */
export const getWeeklySales = async () => {
    try {
        const response  = await axios.get(`${serverURL}/statistics/sales/weekly`, initAuthorizationHeader());
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Fetches the monthly sales data from the server
 * @returns {Promise<Object>} The sales data for the month
 */
export const getMonthlySales = async () => {
    try {
        const response = await axios.get(`${serverURL}/statistics/sales/monthly`, initAuthorizationHeader());
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Fetches the quarterly sales data from the server
 * @returns {Promise<Object>} The sales data for the quarter
 */
export const getQuarterlySales = async () => {
    try {
        const response  = await axios.get(`${serverURL}/statistics/sales/quarterly`, initAuthorizationHeader());
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Fetches the yearly sales data from the server
 * @returns {Promise<Object>} The sales data for the year
 */
export const getYearlySales = async () => {
    try {
        const response = await axios.get(`${serverURL}/statistics/sales/yearly`, initAuthorizationHeader());
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

