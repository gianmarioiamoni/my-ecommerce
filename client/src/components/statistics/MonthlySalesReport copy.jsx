import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    CircularProgress, Typography, Container, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button
} from '@mui/material';
import { getMonthlySales } from '../../services/statisticsServices';
import * as XLSX from 'xlsx';

const MonthlySalesReport = () => {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSalesData = async () => {
        try {
            const monthlyData = await getMonthlySales();
            const formattedData = monthlyData.map((item) => ({
                month: item._id,
                totalSales: item.totalSales,
                totalOrders: item.totalOrders,
            }));
            setSalesData(formattedData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sales data:', error);
        }
    };

    useEffect(() => {
        fetchSalesData();
    }, []);

    // Function to export data as CSV
    const exportCSV = () => {
        const csvRows = [];
        const headers = ['Month', 'Total Sales (€)', 'Total Orders'];
        csvRows.push(headers.join(','));

        salesData.forEach(row => {
            const values = [row.month, row.totalSales.toFixed(2), row.totalOrders];
            csvRows.push(values.join(','));
        });

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "monthly_sales_report.csv");
        document.body.appendChild(link);
        link.click();
    };

    // Function to export data as Excel
    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(salesData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Sales");

        XLSX.utils.sheet_add_aoa(worksheet, [['Month', 'Total Sales (€)', 'Total Orders']], { origin: 'A1' });

        // Auto width adjustment for columns
        const max_width = salesData.reduce((max, row) => Math.max(max, row.month.length), 10);
        worksheet['!cols'] = [{ wch: max_width }, { wch: 15 }, { wch: 12 }];

        XLSX.writeFile(workbook, "monthly_sales_report.xlsx");
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Monthly Sales Report
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={salesData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="month"
                                    label={{ value: 'Month', position: 'insideBottomRight', offset: -10 }}
                                    tickLine={false}
                                />
                                <YAxis
                                    label={{ value: 'Sales (€)', angle: -90, position: 'insideLeft' }}
                                    tickLine={false}
                                />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="totalSales" stroke="#8884d8" name="Total Sales" />
                            </LineChart>
                        </ResponsiveContainer>

                        {/* Buttons for Export */}
                        <Box mt={4} display="flex" justifyContent="center" gap={2}>
                            <Button variant="contained" color="primary" onClick={exportCSV}>
                                Export CSV
                            </Button>
                            <Button variant="contained" color="secondary" onClick={exportExcel}>
                                Export Excel
                            </Button>
                        </Box>

                        {/* Summary Table */}
                        <Box mt={4}>
                            <Typography variant="h6" align="center" gutterBottom>
                                Sales Summary
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Month</TableCell>
                                            <TableCell align="center">Total Sales (€)</TableCell>
                                            <TableCell align="center">Total Orders</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {salesData.map((row) => (
                                            <TableRow key={row.month}>
                                                <TableCell align="center">{row.month}</TableCell>
                                                <TableCell align="center">{row.totalSales.toFixed(2)}</TableCell>
                                                <TableCell align="center">{row.totalOrders}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default MonthlySalesReport;


