import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography, Container, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation(); 
    const [currentTab, setCurrentTab] = useState(0);

    const handleChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom align="center">
                    {t('salesReportsPage.header')}
                </Typography>

                {/* Tabs for selecting different report views */}
                <Tabs
                    value={currentTab}
                    onChange={handleChange}
                    aria-label={t('salesReportsPage.tabsAriaLabel')}
                    centered
                >
                    <Tab label={t('salesReportsPage.weekly')} id="tab-0" aria-controls="tabpanel-0" />
                    <Tab label={t('salesReportsPage.monthly')} id="tab-1" aria-controls="tabpanel-1" />
                    <Tab label={t('salesReportsPage.yearly')} id="tab-2" aria-controls="tabpanel-2" />
                    {/* Add new tabs here */}
                </Tabs>

                {/* Tab Panel Content */}
                <TabPanel value={currentTab} index={0}>
                    <SalesReport
                        getSalesFunction={getWeeklySales}
                        CSVheader={t('salesReportsPage.csvHeaders.week')}
                        excelHeader={t('salesReportsPage.excelHeaders.weekly')}
                        periodName={t('salesReportsPage.periodNames.week')}
                        valueKey="week"
                        filePrefix="weekly"
                        header={t('salesReportsPage.headers.weekly')}
                    />
                </TabPanel>

                <TabPanel value={currentTab} index={1}>
                    <SalesReport
                        getSalesFunction={getMonthlySales}
                        CSVheader={t('salesReportsPage.csvHeaders.month')}
                        excelHeader={t('salesReportsPage.excelHeaders.monthly')}
                        periodName={t('salesReportsPage.periodNames.month')}
                        valueKey="month"
                        filePrefix="monthly"
                        header={t('salesReportsPage.headers.monthly')}
                    />
                </TabPanel>

                <TabPanel value={currentTab} index={2}>
                    <SalesReport
                        getSalesFunction={getYearlySales}
                        CSVheader={t('salesReportsPage.csvHeaders.year')}
                        excelHeader={t('salesReportsPage.excelHeaders.yearly')}
                        periodName={t('salesReportsPage.periodNames.year')}
                        valueKey="year"
                        filePrefix="yearly"
                        header={t('salesReportsPage.headers.yearly')}
                    />
                </TabPanel>

                {/* Add new tab panels here */}
            </Paper>
        </Container>
    );
};

export default SalesReportsPage;



