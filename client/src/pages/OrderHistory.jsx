import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Grid, Card, CardContent, CircularProgress, TextField, MenuItem, Select, InputLabel, FormControl, Box, Pagination, Avatar } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { getOrderHistory } from '../services/ordersServices';

const OrderHistory = () => {
    const { user } = useContext(AuthContext);
    const [allOrders, setAllOrders] = useState([]);
    const [displayedOrders, setDisplayedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState('createdAt');
    const [order, setOrder] = useState('desc');
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                setLoading(true);
                const response = await getOrderHistory(user.id, {
                    page,
                    limit,
                    sort,
                    order,
                    search,
                    startDate,
                    endDate
                });
                setAllOrders(response.orders || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching order history:', error);
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, [user.id]);

    useEffect(() => {
        let filteredOrders = allOrders;

        if (search) {
            filteredOrders = filteredOrders.filter(order =>
                order.products.some(item => item.product.name.toLowerCase().includes(search.toLowerCase()))
            );
        }

        if (startDate) {
            filteredOrders = filteredOrders.filter(order =>
                new Date(order.createdAt) >= new Date(startDate)
            );
        }

        if (endDate) {
            filteredOrders = filteredOrders.filter(order =>
                new Date(order.createdAt) <= new Date(endDate)
            );
        }

        filteredOrders = filteredOrders.sort((a, b) => {
            const aValue = a[sort];
            const bValue = b[sort];
            if (aValue < bValue) return order === 'asc' ? -1 : 1;
            if (aValue > bValue) return order === 'asc' ? 1 : -1;
            return 0;
        });

        setDisplayedOrders(filteredOrders.slice((page - 1) * limit, page * limit));
    }, [allOrders, search, startDate, endDate, sort, order, page, limit]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Order History
            </Typography>

            <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                    <TextField
                        label="Search Orders"
                        variant="outlined"
                        fullWidth
                        value={search}
                        onChange={handleSearch}
                    />
                </Grid>
                <Grid item xs={6} md={2}>
                    <FormControl fullWidth>
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            label="Sort By"
                        >
                            <MenuItem value="createdAt">Date</MenuItem>
                            <MenuItem value="totalAmount">Amount</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={2}>
                    <FormControl fullWidth>
                        <InputLabel>Order</InputLabel>
                        <Select
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            label="Order"
                        >
                            <MenuItem value="asc">Ascending</MenuItem>
                            <MenuItem value="desc">Descending</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={2}>
                    <TextField
                        label="Start Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6} md={2}>
                    <TextField
                        label="End Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 3 }}>
                {displayedOrders.length > 0 ? (
                    displayedOrders.map((order) => (
                        <Grid item xs={12} sm={6} md={4} key={order._id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6">Order ID: {order._id}</Typography>
                                    <Typography variant="body1">Total Amount: ${order.totalAmount}</Typography>
                                    <Typography variant="body2">Order Date: {new Date(order.createdAt).toLocaleDateString()}</Typography>
                                    <Typography variant="body2" gutterBottom>Products:</Typography>
                                    <Box component="ul" sx={{ pl: 2 }}>
                                        {order.products.map((item) => (
                                            <Box
                                                key={item.product._id}
                                                component="li"
                                                display="flex"
                                                alignItems="center"
                                                mb={1}
                                            >
                                                <Avatar
                                                    src={item.product.imageUrls[0]} // Assicurati che il campo sia corretto
                                                    alt={item.product.name}
                                                    variant="rounded"
                                                    sx={{ width: 56, height: 56, mr: 2 }}
                                                />
                                                {item.product.name} - Quantity: {item.quantity}
                                            </Box>
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="body1" align="center">No orders found.</Typography>
                    </Grid>
                )}
            </Grid>

            <Box mt={4} display="flex" justifyContent="center">
                <Pagination
                    count={Math.ceil(allOrders.length / limit)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </Container>
    );
};

export default OrderHistory;




