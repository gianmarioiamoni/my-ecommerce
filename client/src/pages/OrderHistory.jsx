import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Grid, Card, CardContent, CircularProgress, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { getOrderHistory } from '../services/ordersServices';
import Pagination from '@mui/material/Pagination';

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
        return <CircularProgress />;
    }

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Order History
            </Typography>
            <Grid container spacing={4} alignItems="center">
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
                        <Select value={sort} onChange={(e) => setSort(e.target.value)}>
                            <MenuItem value="createdAt">Date</MenuItem>
                            <MenuItem value="totalAmount">Amount</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={2}>
                    <FormControl fullWidth>
                        <InputLabel>Order</InputLabel>
                        <Select value={order} onChange={(e) => setOrder(e.target.value)}>
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
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6} md={2}>
                    <TextField
                        label="End Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={4} sx={{ marginTop: 2 }}>
                {displayedOrders.length > 0 ? (
                    displayedOrders.map((order) => (
                        <Grid item xs={12} key={order._id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Order ID: {order._id}</Typography>
                                    <Typography variant="body1">Total Amount: ${order.totalAmount}</Typography>
                                    <Typography variant="body2">Order Date: {new Date(order.createdAt).toLocaleDateString()}</Typography>
                                    <Typography variant="body2" gutterBottom>Products:</Typography>
                                    <ul>
                                        {order.products.map((item) => (
                                            <li key={item.product._id}>
                                                {item.product.name} - Quantity: {item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1">No orders found.</Typography>
                )}
            </Grid>
            <Pagination
                count={Math.ceil(allOrders.length / limit)}
                page={page}
                onChange={handlePageChange}
                sx={{ marginTop: 3, justifyContent: 'center', display: 'flex' }}
            />
        </Container>
    );
};

export default OrderHistory;

