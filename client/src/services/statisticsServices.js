import axios from "axios";

import serverURL from "../config/serverURL";
import { initAuthorizationHeader } from "../config/initAuthorizationHeader";

export const getWeeklySales = async () => {
    try {
        // initAuthorizationHeader();
        const response  = await axios.get(`${serverURL}/statistics/sales/weekly`, initAuthorizationHeader());
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getMonthlySales = async () => {
    try {
        const response = await axios.get(`${serverURL}/statistics/sales/monthly`, initAuthorizationHeader());
        console.log("response.data", response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getQuarterlySales = async () => {
    try {
        const response  = await axios.get(`${serverURL}/statistics/sales/quarterly`, initAuthorizationHeader());
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getYearlySales = async () => {
    try {
        const response  = await axios.get(`${serverURL}/statistics/sales/yearly`, initAuthorizationHeader());
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

