// src/pages/UserBehaviorDashboard.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Importa useTranslation
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Button,
    TextField,
    Tabs,
    Tab,
    Box,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { getEvents } from '../../services/eventsServices';

// Register the needed components 
ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
);

/**
 * Component to display the user behavior dashboard.
 *
 * @returns {ReactElement} The dashboard component
 */
const UserBehaviorDashboard = () => {
    const { t } = useTranslation('userBehaviorDashboard'); // Use the translation hook with the namespace
    const [data, setData] = useState([]); // The data to display
    const [loading, setLoading] = useState(true); // The loading state
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        return sevenDaysAgo.toISOString().split('T')[0];
    }); // The start date
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]); // The end date
    const theme = useTheme(); // The theme
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Whether the screen is mobile or not

    const [tabValue, setTabValue] = useState(0); // The selected tab

    /**
     * Handles the tab change event
     * @param {React.ChangeEvent<HTMLDivElement>} event - The event
     * @param {number} newValue - The new value
     */
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    /**
     * Fetches the data from the server
     */
    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await getEvents(startDate, endDate);
            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate]);

    /**
     * Aggregates the data by date
     * @param {Array} events - The events to aggregate
     * @param {Array<string>} eventTypes - The event types to filter by
     * @returns {Object} The aggregated data
     */
    const aggregateData = (events, eventTypes) => {
        const aggregation = {};

        events
            .filter(event => eventTypes.includes(event.eventType))
            .forEach(event => {
                const date = new Date(event.timestamp).toLocaleDateString();
                if (!aggregation[date]) {
                    aggregation[date] = 0;
                }
                aggregation[date] += 1;
            });

        return {
            labels: Object.keys(aggregation),
            data: Object.values(aggregation),
        };
    };

    /**
     * Creates the chart data for the product clicks chart
     * @returns {Object} The chart data
     */
    const chartDataClicks = () => {
        if (data.length === 0) return { labels: [], datasets: [] };

        const aggregatedData = aggregateData(data, ['view']);

        return {
            labels: aggregatedData.labels,
            datasets: [
                {
                    label: t('productClicksLabel'), 
                    data: aggregatedData.data,
                    borderColor: theme.palette.primary.main,
                    backgroundColor: theme.palette.primary.light,
                    fill: false,
                    tension: 0.1,
                },
            ],
        };
    };

    const chartDataAddToCart = () => {
        if (data.length === 0) return { labels: [], datasets: [] };

        const aggregatedDataNew = aggregateData(data, ['add_to_cart_new']);
        const aggregatedDataRemoving = aggregateData(data, ['remove_from_cart']);

        // Assuring that both datasets have the same labels (dates) in the x axis
        const allLabels = Array.from(
            new Set([...aggregatedDataNew.labels, ...aggregatedDataRemoving.labels])
        ).sort((a, b) => new Date(a) - new Date(b));

        const getDataByLabels = (labels, aggregatedData) =>
            labels.map(label => {
                const index = aggregatedData.labels.indexOf(label);
                return index !== -1 ? aggregatedData.data[index] : 0;
            });

        const dataNew = getDataByLabels(allLabels, aggregatedDataNew);
        const dataRemoving = getDataByLabels(allLabels, aggregatedDataRemoving);

        return {
            labels: allLabels,
            datasets: [
                {
                    label: t('addToCartLabel'),
                    data: dataNew,
                    borderColor: theme.palette.success.main,
                    backgroundColor: theme.palette.success.light,
                    fill: false,
                    tension: 0.1,
                },
                {
                    label: t('removeFromCartLabel'),
                    data: dataRemoving,
                    borderColor: theme.palette.warning.main,
                    backgroundColor: theme.palette.warning.light,
                    fill: false,
                    tension: 0.1,
                },
            ],
        };
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: t('dateLabel'),
                },
            },
            y: {
                title: {
                    display: true,
                    text: t('countLabel'),
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" align="center" gutterBottom>
                {t('dashboardTitle')}
            </Typography>

            {/* Dates selection section */}
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label={t('startDateLabel')}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label={t('endDateLabel')}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={fetchData}
                        disabled={loading}
                    >
                        {loading ? t('loadingLabel') : t('filterLabel')}
                    </Button>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Box sx={{ width: '100%', marginTop: '2rem' }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    centered={!isMobile}
                    variant={isMobile ? 'scrollable' : 'fullWidth'}
                    scrollButtons="auto"
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab label={t('productClicksTabLabel')} />
                    <Tab label={t('addToCartEventsTabLabel')} />
                </Tabs>

                {/* Tab content */}
                {tabValue === 0 && (
                    <Box p={3}>
                        <Card>
                            <CardContent>
                                {loading ? (
                                    <CircularProgress />
                                ) : (
                                    <Line data={chartDataClicks()} options={options} />
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                )}
                {tabValue === 1 && (
                    <Box p={3}>
                        <Card>
                            <CardContent>
                                {loading ? (
                                    <CircularProgress />
                                ) : (
                                    <Line data={chartDataAddToCart()} options={options} />
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default UserBehaviorDashboard;


