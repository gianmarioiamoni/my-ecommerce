import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    useMediaQuery,
    Button,
    TextField,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import { useTheme } from '@mui/material/styles';

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

// Registra i componenti necessari
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

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await getEvents(startDate, endDate);
            console.log(result);
            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    const aggregateData = (events) => {
        const aggregation = {};

        events.forEach(event => {
            const date = new Date(event.timestamp).toLocaleDateString();
            if (!aggregation[date]) {
                aggregation[date] = 0;
            }
            aggregation[date] += 1; // Incrementa il conteggio per questa data
        });

        return {
            labels: Object.keys(aggregation),
            data: Object.values(aggregation),
        };
    };

    // Calcola i dati per il grafico
    const chartData = () => {
        if (data.length === 0) return { labels: [], datasets: [] }; // Default if no data

        const aggregatedData = aggregateData(data);

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

    const options = {
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
                    text: 'Number of Clicks',
                },
            },
        },
        plugins: {
            legend: {
                display: true,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Clicks: ${context.raw}`;
                    },
                },
            },
        },
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                User Behavior Dashboard
            </Typography>

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

            <Grid container spacing={2} style={{ marginTop: '2rem' }}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            {loading ? (
                                <CircularProgress />
                            ) : (
                                <Line data={chartData()} options={options} />
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default UserBehaviorDashboard;
