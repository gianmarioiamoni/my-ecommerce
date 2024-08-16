import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CircularProgress, MenuItem, Select, FormControl, TextField, InputLabel, Box, Pagination, Avatar } from '@mui/material';
import { getAllOrders, updateOrderStatus } from '../services/ordersServices';

const AdminOrderConsole = () => {
    const [orders, setOrders] = useState([]);
    const [displayedOrders, setDisplayedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState('createdAt');
    const [order, setOrder] = useState('desc');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterUser, setFilterUser] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await getAllOrders();

                if (Array.isArray(data)) {
                    setOrders(data);
                    setDisplayedOrders(data); // inizialmente mostra tutti gli ordini
                } else {
                    console.error('Unexpected data format:', data);
                    setOrders([]);
                    setDisplayedOrders([]);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, status) => {
        try {
            const updatedOrder = await updateOrderStatus(orderId, status);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: updatedOrder.status } : order
                )
            );
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    useEffect(() => {
        let filteredOrders = orders;

        if (search) {
            filteredOrders = filteredOrders.filter(order =>
                order.products.some(item => item.product.name.toLowerCase().includes(search.toLowerCase()))
            );
        }

        if (filterStatus) {
            filteredOrders = filteredOrders.filter(order => order.status === filterStatus);
        }

        if (filterUser) {
            filteredOrders = filteredOrders.filter(order =>
                order.userId.name.toLowerCase().includes(filterUser.toLowerCase()) ||
                order.userId.email.toLowerCase().includes(filterUser.toLowerCase())
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
    }, [orders, search, filterStatus, filterUser, sort, order, page, limit]);

    const handlePageChange = (event, value) => {
        setPage(value);
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
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
                Admin Order Console
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }} alignItems="center">
                <Grid item xs={12} md={4}>
                    <TextField
                        label="Search Orders by Product"
                        variant="outlined"
                        fullWidth
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        label="Search Orders by User"
                        variant="outlined"
                        fullWidth
                        value={filterUser}
                        onChange={(e) => {
                            setFilterUser(e.target.value);
                            setPage(1);
                        }}
                    />
                </Grid>
                <Grid item xs={6} md={2}>
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={filterStatus}
                            onChange={(e) => {
                                setFilterStatus(e.target.value);
                                setPage(1);
                            }}
                            label="Status"
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Shipped">Shipped</MenuItem>
                            <MenuItem value="Delivered">Delivered</MenuItem>
                        </Select>
                    </FormControl>
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
                <Grid item xs={12} md={2}>
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
            </Grid>

            <Grid container spacing={4}>
                {displayedOrders.map((order) => (
                    <Grid item xs={12} sm={6} md={4} key={order._id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Order ID: {order._id}</Typography>
                                <Typography variant="body1"><strong>Total Amount:</strong> ${order.totalAmount}</Typography>
                                <Typography variant="body2"><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</Typography>
                                <Typography variant="body2"><strong>User:</strong> {order.userId.name} ({order.userId.email})</Typography>
                                <Typography variant="body2" gutterBottom><strong>Status:</strong> {order.status}</Typography>

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
                                                src={item.product.imageUrls[0]}
                                                alt={item.product.name}
                                                variant="rounded"
                                                sx={{ width: 56, height: 56, mr: 2 }}
                                            />
                                            {item.product.name} - Quantity: {item.quantity}
                                        </Box>
                                    ))}
                                </Box>

                                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                                    <Select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    >
                                        <MenuItem value="In Progress">In Progress</MenuItem>
                                        <MenuItem value="Shipped">Shipped</MenuItem>
                                        <MenuItem value="Delivered">Delivered</MenuItem>
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box mt={4} display="flex" justifyContent="center">
                <Pagination
                    count={Math.ceil(orders.length / limit)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </Container>
    );
};

export default AdminOrderConsole;



