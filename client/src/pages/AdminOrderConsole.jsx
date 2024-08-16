import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CircularProgress, MenuItem, Select, FormControl, TextField, Box, Pagination } from '@mui/material';
import { getAllOrders, getAllUsersWithOrders, updateOrderStatus } from '../services/ordersServices';

const AdminOrderConsole = () => {
    const [orders, setOrders] = useState([]);
    const [displayedOrders, setDisplayedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [statusFilter, setStatusFilter] = useState('');
    const [userFilter, setUserFilter] = useState('');
    const [users, setUsers] = useState([]);
    const [userSearch, setUserSearch] = useState('');

    useEffect(() => {
        const fetchOrdersAndUsers = async () => {
            try {
                setLoading(true);
                const [ordersData, usersData] = await Promise.all([getAllOrders(), getAllUsersWithOrders()]);

                if (Array.isArray(ordersData)) {
                    setOrders(ordersData);
                } else {
                    console.error('Unexpected data format for orders:', ordersData);
                    setOrders([]);
                }

                if (Array.isArray(usersData)) {
                    setUsers(usersData);
                } else {
                    console.error('Unexpected data format for users:', usersData);
                    setUsers([]);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders and users:', error);
                setLoading(false);
            }
        };

        fetchOrdersAndUsers();
    }, []);

    useEffect(() => {
        let filteredOrders = orders;

        if (search) {
            filteredOrders = filteredOrders.filter(order =>
                order.products.some(item =>
                    item.product.name.toLowerCase().includes(search.toLowerCase())
                )
            );
        }

        if (statusFilter) {
            filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
        }

        if (userFilter) {
            filteredOrders = filteredOrders.filter(order =>
                order.userId._id === userFilter
            );
        }

        filteredOrders = filteredOrders.sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        setDisplayedOrders(filteredOrders.slice((page - 1) * limit, page * limit));
    }, [orders, search, statusFilter, userFilter, sortField, sortOrder, page, limit]);

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

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleUserFilterChange = (event) => {
        setUserFilter(event.target.value);
        setPage(1); // Reset page to 1 on user filter change
    };

    const handleUserSearch = (event) => {
        setUserSearch(event.target.value.toLowerCase());
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(userSearch) ||
        user.email.toLowerCase().includes(userSearch)
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!Array.isArray(orders)) {
        return <Typography variant="body1">Error loading orders. Please try again later.</Typography>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
                Admin Order Console
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Search Products"
                        variant="outlined"
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <Select
                            displayEmpty
                            value={userFilter}
                            onChange={handleUserFilterChange}
                            inputProps={{ 'aria-label': 'Without label' }}
                            renderValue={(selected) => {
                                const selectedUser = users.find(user => user._id === selected);
                                return selectedUser ? `${selectedUser.name} (${selectedUser.email})` : <em>All Users</em>; 
                            }}
                        >
                            <MenuItem value="">
                                <em>All Users</em>
                            </MenuItem>
                            {filteredUsers.map(user => (
                                <MenuItem key={user._id} value={user._id}>
                                    {user.name} ({user.email})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value=""><em>All Statuses</em></MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Shipped">Shipped</MenuItem>
                            <MenuItem value="Delivered">Delivered</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <Select
                            value={sortField}
                            onChange={(e) => setSortField(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="createdAt">Sort by Date</MenuItem>
                            <MenuItem value="totalAmount">Sort by Amount</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mt: 1 }}>
                        <Select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            displayEmpty
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



