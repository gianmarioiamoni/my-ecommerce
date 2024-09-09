// src/pages/UserBehaviorDashboard.js
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

import { getEvents } from '../services/eventService';

const UserBehaviorDashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


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
        // Initial data fetching
        fetchData();
    }, []);

    // Data for the chart
    const chartData = {
        labels: data.map((event) => new Date(event.timestamp).toLocaleDateString()),
        datasets: [
            {
                label: 'Product Clicks',
                data: data.map((event) => event.productId), // Modifica in base ai tuoi dati
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.primary.light,
                fill: false,
                tension: 0.1,
            },
        ],
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom>
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

            {/* Chart section */}
            <Grid container spacing={2} style={{ marginTop: '2rem' }}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            {loading ? (
                                <CircularProgress />
                            ) : (
                                <Line data={chartData} />
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default UserBehaviorDashboard;
