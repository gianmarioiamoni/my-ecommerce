import Order from "../models/Order.js";


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

export const getMonthlySales = async (req, res) => {
    console.log('Fetching monthly sales...');
    try {
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
        console.log('Received monthly data:', sales);
        res.json(sales);
    } catch (error) {
        console.error('Error fetching monthly sales:', error);
        res.status(500).json({ message: 'Error fetching monthly sales' });
    }
};


export const getQuarterlySales = async (req, res) => {
    console.log('Fetching quarterly sales...');
    try {
        const sales = await Order.aggregate([
            {
                $match: {
                    status: 'Delivered', // Considera solo gli ordini consegnati
                },
            },
            {
                $project: {
                    quarter: { // Calcola il trimestre manualmente con cond annidati
                        $cond: [
                            { $lte: [{ $month: '$createdAt' }, 3] }, 1, // Primo trimestre
                            {
                                $cond: [
                                    { $lte: [{ $month: '$createdAt' }, 6] }, 2, // Secondo trimestre
                                    {
                                        $cond: [
                                            { $lte: [{ $month: '$createdAt' }, 9] }, 3, // Terzo trimestre
                                            4 // Quarto trimestre
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    totalAmount: 1, // Mantiene l'importo totale
                },
            },
            {
                $group: {
                    _id: { quarter: '$quarter' }, // Raggruppa per trimestre
                    totalSales: { $sum: '$totalAmount' }, // Somma delle vendite
                    totalOrders: { $sum: 1 }, // Conteggio ordini
                },
            },
            { $sort: { '_id.quarter': 1 } }, // Ordina per trimestre
        ]);

        console.log('Received quarterly data:', sales);
        res.json(sales);
    } catch (error) {
        console.error('Error fetching quarterly sales:', error);
        res.status(500).json({ message: 'Error fetching quarterly sales' });
    }
};




export const getYearlySales = async (req, res) => {
    try {
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
        res.status(500).json({ message: 'Error fetching yearly sales' });
    }
}