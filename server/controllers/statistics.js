import Order from "../models/Order.js";


/**
 * Get the total sales and total orders for each week
 * @param {Object} req The Express request object
 * @param {Object} res The Express response object
 * @return {Promise<void>}
 */
export const getWeeklySales = async (req, res) => {
    try {
        const sales = await Order.aggregate([
            {
                $match: {
                    status: 'Delivered', // Considering only delivered orders
                },
            },
            {
                $group: {
                    _id: { $week: '$createdAt' }, // Group by week
                    totalSales: { $sum: '$totalAmount' }, // Sum the total sales
                    totalOrders: { $sum: 1 }, // Counts the total orders
                },
            },
            { $sort: { _id: 1 } }, // Order by week
        ]);
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching weekly sales' });
    }
}

/**
 * Get the total sales and total orders for each month
 * @param {Object} req The Express request object
 * @param {Object} res The Express response object
 * @return {Promise<void>}
 */
export const getMonthlySales = async (req, res) => {
    try {
        /**
         * The aggregation pipeline
         * 1. Match: consider only delivered orders
         * 2. Group: group by month, sum the total sales and count the total orders
         * 3. Sort: sort by month
         */
        const sales = await Order.aggregate([
            {
                $match: {
                    status: 'Delivered', // Considering only delivered orders
                },
            },
            {
                $group: {
                    _id: { $month: '$createdAt' }, // Group by month
                    totalSales: { $sum: '$totalAmount' }, // Sum the total sales
                    totalOrders: { $sum: 1 }, // Counts the total orders
                },
            },
            { $sort: { _id: 1 } }, // Order by month
        ]);
        res.json(sales);
    } catch (error) {
        console.error('Error fetching monthly sales:', error);
        res.status(500).json({ message: 'Error fetching monthly sales' });
    }
};


/**
 * Get the total sales and total orders for each quarter
 * @param {Object} req The Express request object
 * @param {Object} res The Express response object
 * @return {Promise<void>}
 */
export const getQuarterlySales = async (req, res) => {
    try {
        /**
         * The aggregation pipeline
         * 1. Match: consider only delivered orders
         * 2. Project: calculate the quarter and keep the totalAmount
         * 3. Group: group by quarter, sum the total sales and count the total orders
         * 4. Sort: sort by quarter
         */
        const sales = await Order.aggregate([
            {
                $match: {
                    status: 'Delivered', // Considering only delivered orders
                },
            },
            {
                $project: {
                    quarter: { // Calculate the quarter manually with nested conditions
                        $cond: [
                            { $lte: [{ $month: '$createdAt' }, 3] }, 1, // First quarter
                            {
                                $cond: [
                                    { $lte: [{ $month: '$createdAt' }, 6] }, 2, // Second quarter
                                    {
                                        $cond: [
                                            { $lte: [{ $month: '$createdAt' }, 9] }, 3, // Third quarter
                                            4 // Fourth quarter
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    totalAmount: 1, // Keep the total amount
                },
            },
            {
                $group: {
                    _id: { quarter: '$quarter' }, // Group by quarter
                    totalSales: { $sum: '$totalAmount' }, // Sum the total sales
                    totalOrders: { $sum: 1 }, // Count the total orders
                },
            },
            { $sort: { '_id.quarter': 1 } }, // Sort by quarter
        ]);

        res.json(sales);
    } catch (error) {
        console.error('Error fetching quarterly sales:', error);
        res.status(500).json({ message: 'Error fetching quarterly sales' });
    }
};


/**
 * Get the total sales and total orders for each year
 * @param {Object} req The Express request object
 * @param {Object} res The Express response object
 * @return {Promise<void>}
 */
export const getYearlySales = async (req, res) => {
    try {
        /**
         * The aggregation pipeline
         * 1. Match: consider only delivered orders
         * 2. Group: group by year, sum the total sales and count the total orders
         * 3. Sort: sort by year
         */
        const sales = await Order.aggregate([
            {
                $match: {
                    status: 'Delivered', // Considering only delivered orders
                },
            },
            {
                $group: {
                    _id: { $year: '$createdAt' }, // Group by year
                    totalSales: { $sum: '$totalAmount' }, // Sum the total sales
                    totalOrders: { $sum: 1 }, // Counts the total orders
                },
            },
            { $sort: { _id: 1 } }, // Order by year
        ]);
        res.json(sales);
    } catch (error) {
        console.error('Error fetching yearly sales:', error);
        res.status(500).json({ message: 'Error fetching yearly sales' });
    }
}
