import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography, Container, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SalesReport from '../../components/statistics/SalesReport';
import { getWeeklySales, getMonthlySales, getQuarterlySales, getYearlySales } from '../../services/statisticsServices';

/**
 * TabPanel component
 *
 * This component renders the content of each tab. It's a wrapper around
 * the actual content of the tab, which is passed as a children prop.
 *
 * @param {Object} props - The props
 * @param {React.ReactNode} props.children - The content of the tab
 * @param {number} props.value - The value of the tab
 * @param {number} props.index - The index of the tab
 * @param {Object} props.other - Other props
 * @returns {React.ReactNode} The rendered component
 */
const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            // The role and id props are needed for accessibility
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                // The Box component is used to add some padding to the content
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

/**
 * Component to display sales reports.
 *
 * This component renders a tab component with four tabs: weekly, monthly, quarterly and yearly.
 * Each tab has a corresponding TabPanel component that renders a SalesReport component.
 * The SalesReport component takes in a prop for the function to fetch the sales data, and props
 * for the CSV header, Excel header, period name, value key, file prefix and header.
 *
 * @returns {ReactElement} The rendered component
 */
const SalesReportsPage = () => {
    const { t } = useTranslation(); 
    const [currentTab, setCurrentTab] = useState(0);

    /**
     * Handles the tab change event
     * @param {React.SyntheticEvent} event - The event
     * @param {number} newValue - The new value
     */
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
                        /**
                         * The function to fetch the sales data
                         * @param {string} [period=last week] - The period to fetch the sales data for
                         * @returns {Promise<SalesReportData[]>} - The sales data
                         */
                        getSalesFunction={getWeeklySales}
                        /**
                         * The translation key for the CSV header
                         * @type {string}
                         */
                        CSVheader={t('salesReportsPage.csvHeaders.week')}
                        /**
                         * The translation key for the Excel header
                         * @type {string}
                         */
                        excelHeader={t('salesReportsPage.excelHeaders.weekly')}
                        /**
                         * The translation key for the period name
                         * @type {string}
                         */
                        periodName={t('salesReportsPage.periodNames.week')}
                        /**
                         * The value key for the period
                         * @type {string}
                         */
                        valueKey="week"
                        /**
                         * The file prefix for the CSV and Excel files
                         * @type {string}
                         */
                        filePrefix="weekly"
                        /**
                         * The header for the report
                         * @type {string}
                         */
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



