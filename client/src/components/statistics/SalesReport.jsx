import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    CircularProgress, Typography, Container, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button
} from '@mui/material';
import { getMonthlySales } from '../../services/statisticsServices';
import * as XLSX from 'xlsx';
import { useTranslation } from 'react-i18next';

const SalesReport = ({
    getSalesFunction = getMonthlySales,
    CSVheader = "sales.csvHeader.period",
    excelHeader = "sales.excelHeader",
    periodName = "sales.period",
    filePrefix = "sales.filePrefix",
    header = "sales.header"
}) => {
    const { t } = useTranslation();
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSalesData = async () => {
        try {
            const data = await getSalesFunction();
            const formattedData = data.map((item) => ({
                period: item._id,
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
        const headers = [t(CSVheader), t('sales.csvHeader.totalSales'), t('sales.csvHeader.totalOrders')];
        csvRows.push(headers.join(','));

        salesData.forEach(row => {
            const values = [row.period, row.totalSales.toFixed(2), row.totalOrders];
            csvRows.push(values.join(','));
        });

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", t(filePrefix) + "_sales_report.csv");
        document.body.appendChild(link);
        link.click();
    };

    // Function to export data as Excel
    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(salesData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, t(excelHeader));

        XLSX.utils.sheet_add_aoa(worksheet, [[t(periodName), t('sales.csvHeader.totalSales'), t('sales.csvHeader.totalOrders')]], { origin: 'A1' });

        // Auto width adjustment for columns
        const max_width = salesData.reduce((max, row) => Math.max(max, row.period.length), 10);
        worksheet['!cols'] = [{ wch: max_width }, { wch: 15 }, { wch: 12 }];

        XLSX.writeFile(workbook, t(filePrefix) + "_sales_report.xlsx");
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom align="center">
                    {t(header)}
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
                                    dataKey="period"
                                    label={{ value: t(periodName), position: 'insideBottomRight', offset: -10 }}
                                    tickLine={false}
                                />
                                <YAxis
                                    label={{ value: t('sales.yAxisLabel'), angle: -90, position: 'insideLeft' }}
                                    tickLine={false}
                                />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="totalSales" stroke="#8884d8" name={t('sales.legend.totalSales')} />
                            </LineChart>
                        </ResponsiveContainer>

                        {/* Buttons for Export */}
                        <Box mt={4} display="flex" justifyContent="center" gap={2}>
                            <Button variant="contained" color="primary" onClick={exportCSV}>
                                {t('sales.exportCSV')}
                            </Button>
                            <Button variant="contained" color="secondary" onClick={exportExcel}>
                                {t('sales.exportExcel')}
                            </Button>
                        </Box>

                        {/* Summary Table */}
                        <Box mt={4}>
                            <Typography variant="h6" align="center" gutterBottom>
                                {t('sales.summary')}
                            </Typography>
                            <TableContainer>
                                <Table sx={{ borderCollapse: 'collapse' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>{t(periodName)}</TableCell>
                                            <TableCell align="center" sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>{t('sales.csvHeader.totalSales')}</TableCell>
                                            <TableCell align="center" sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>{t('sales.csvHeader.totalOrders')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {salesData.map((row) => (
                                            <TableRow key={row.period}>
                                                <TableCell align="center">{row.period}</TableCell>
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

export default SalesReport;
