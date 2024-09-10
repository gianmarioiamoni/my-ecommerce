// src/pages/UserBehaviorDashboard.js
import React, { useState, useEffect } from 'react';

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

const UserBehaviorDashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        return sevenDaysAgo.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

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

    const chartDataClicks = () => {
        if (data.length === 0) return { labels: [], datasets: [] };

        const aggregatedData = aggregateData(data, ['view']); 

        return {
            labels: aggregatedData.labels,
            datasets: [
                {
                    label: 'Product Clicks',
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
                    label: 'Add to Cart',
                    data: dataNew,
                    borderColor: theme.palette.success.main,
                    backgroundColor: theme.palette.success.light,
                    fill: false,
                    tension: 0.1,
                },
                {
                    label: 'Remove from Cart',
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
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Count',
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
                User Behavior Dashboard
            </Typography>

            {/* Dates selection section */}
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Start Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="End Date"
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
                        {loading ? 'Loading...' : 'Filter'}
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
                    <Tab label="Product Clicks" />
                    <Tab label="Add to Cart Events" />
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

