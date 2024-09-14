// SalesReportsPage.js
import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography, Container, Paper } from '@mui/material';
import SalesReport from '../../components/statistics/SalesReport';
import { getWeeklySales, getMonthlySales, getQuarterlySales, getYearlySales } from '../../services/statisticsServices';

// Component to render the content of each tab
const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const SalesReportsPage = () => {
    const [currentTab, setCurrentTab] = useState(0); 

    const handleChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Sales Reports
                </Typography>

                {/* Tabs for selecting different report views */}
                <Tabs
                    value={currentTab}
                    onChange={handleChange}
                    aria-label="Sales Report Tabs"
                    centered
                >
                    <Tab label="Weekly" id="tab-0" aria-controls="tabpanel-0" />
                    <Tab label="Monthly" id="tab-1" aria-controls="tabpanel-1" />
                    <Tab label="Yearly" id="tab-2" aria-controls="tabpanel-2" />
                    {/* Add new tabs here */}
                </Tabs>

                {/* Tab Panel Content */}
                <TabPanel value={currentTab} index={0}>
                    <SalesReport
                        getSalesFunction={getWeeklySales}
                        CSVheader="Week"
                        excelHeader="Weekly Sales"
                        periodName="Week"
                        valueKey="week"
                        filePrefix="weekly"
                        header="Weekly Sales Report"
                    />
                </TabPanel>

                <TabPanel value={currentTab} index={1}>
                    <SalesReport 
                        getSalesFunction={getMonthlySales}
                        CSVheader="Month"
                        excelHeader="Monthly Sales"
                        periodName="Month"
                        valueKey="month"
                        filePrefix="monthly"
                        header="Monthly Sales Report"
                    /> 
                </TabPanel>

                <TabPanel value={currentTab} index={2}>
                    <SalesReport
                        getSalesFunction={getYearlySales}
                        CSVheader="Year"
                        excelHeader="Yearly Sales"
                        periodName="Year"
                        valueKey="year"
                        filePrefix="yearly"
                        header="Yearly Sales Report"
                    />
                </TabPanel>

                {/* Add new tab panels here */}
            </Paper>
        </Container>
    );
};

export default SalesReportsPage;


