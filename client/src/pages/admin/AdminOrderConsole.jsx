import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Grid, Card, CardContent, CircularProgress, MenuItem, Select, FormControl, TextField, Box, Pagination } from '@mui/material';
import { getAllOrders, getAllUsersWithOrders, updateOrderStatus } from '../../services/ordersServices';

/**
 * The AdminOrderConsole component is a page to manage orders.
 * It fetches all orders and users with orders from the server.
 * It displays a list of orders with their details.
 * It allows the user to filter orders by search, user and status.
 * It allows the user to sort orders by order date, total amount and order id.
 * It allows the user to update the status of an order.
 * It displays a pagination to navigate through the list of orders.
 * @returns {JSX.Element} The JSX element for the AdminOrderConsole component
 */
const AdminOrderConsole = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [displayedOrders, setDisplayedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [statusFilter, setStatusFilter] = useState('');
    const [userFilter, setUserFilter] = useState('');
    const [users, setUsers] = useState([]);
    const [userSearch, setUserSearch] = useState('');

    /**
     * Fetches all orders and users with orders from the server.
     */
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

    /**
     * Filters the orders based on the search, user filter and status filter.
     * It also sorts the orders by the selected field and order.
     */
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

    /**
     * Handles the status change of an order.
     * @param {string} orderId - The id of the order
     * @param {string} status - The new status of the order
     */
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

    /**
     * Handles the page change.
     * @param {React.ChangeEvent<HTMLInputElement>} event - The event
     * @param {number} value - The new page number
     */
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    /**
     * Handles the user filter change.
     * @param {React.ChangeEvent<HTMLInputElement>} event - The event
     */
    const handleUserFilterChange = (event) => {
        setUserFilter(event.target.value);
        setPage(1); // Reset page to 1 on user filter change
    };

    /**
     * Handles the user search.
     * @param {React.ChangeEvent<HTMLInputElement>} event - The event
     */
    const handleUserSearch = (event) => {
        setUserSearch(event.target.value.toLowerCase());
    };

    /**
     * Filters the users based on the user search.
     */
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
        return <Typography variant="body1">{t('adminOrderConsole.loadingError')}</Typography>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
                {t('adminOrderConsole.title')}
            </Typography>
            {/* Searching and filtering */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {/* Search */}
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label={t('adminOrderConsole.searchProducts')}
                        variant="outlined"
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Grid>
                {/* User filter */}
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <Select
                            displayEmpty
                            value={userFilter}
                            onChange={handleUserFilterChange}
                            inputProps={{ 'aria-label': 'Without label' }}
                            renderValue={(selected) => {
                                const selectedUser = users.find(user => user._id === selected);
                                return selectedUser ? selectedUser.name : t('adminOrderConsole.userFilter');
                            }}
                        >
                            <MenuItem value="">
                                <em>{t('adminOrderConsole.allUsers')}</em>
                            </MenuItem>
                            {filteredUsers.map((user) => (
                                <MenuItem key={user._id} value={user._id}>
                                    {user.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                {/* Status filter */}
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <Select
                            displayEmpty
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            inputProps={{ 'aria-label': 'Without label' }}
                            renderValue={(selected) => {
                                return selected ? t(`adminOrderConsole.${selected}`) : t('adminOrderConsole.statusFilter');
                            }}
                        >
                            <MenuItem value="">
                                <em>{t('adminOrderConsole.allUsers')}</em>
                            </MenuItem>
                            <MenuItem value="inProgress">{t('adminOrderConsole.inProgress')}</MenuItem>
                            <MenuItem value="shipped">{t('adminOrderConsole.shipped')}</MenuItem>
                            <MenuItem value="delivered">{t('adminOrderConsole.delivered')}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {/* Sorting */}
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <Select
                            displayEmpty
                            value={sortField}
                            onChange={(e) => setSortField(e.target.value)}
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem value="createdAt">{t('adminOrderConsole.orderDate')}</MenuItem>
                            <MenuItem value="totalAmount">{t('adminOrderConsole.totalAmount')}</MenuItem>
                            <MenuItem value="orderId">{t('adminOrderConsole.orderId')}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <Select
                            displayEmpty
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem value="asc">{t('adminOrderConsole.ascending')}</MenuItem>
                            <MenuItem value="desc">{t('adminOrderConsole.descending')}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            {/* Order List */}
            {displayedOrders.map((order) => (
                <Card key={order._id} sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6">{t('adminOrderConsole.orderId')}: {order._id}</Typography>
                        <Typography variant="body2">{t('adminOrderConsole.totalAmount')}: ${order.totalAmount}</Typography>
                        <Typography variant="body2">{t('adminOrderConsole.orderDate')}: {new Date(order.createdAt).toLocaleDateString()}</Typography>
                        <Typography variant="body2">{t('adminOrderConsole.user')}: {order.userId.name}</Typography>
                        <Typography variant="body2">{t('adminOrderConsole.products')}:</Typography>
                        <ul>
                            {order.products.map((item, index) => (
                                <li key={index}>{item.product.name} - {item.quantity}</li>
                            ))}
                        </ul>
                        <FormControl fullWidth>
                            <Select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            >
                                <MenuItem value="inProgress">{t('adminOrderConsole.inProgress')}</MenuItem>
                                <MenuItem value="shipped">{t('adminOrderConsole.shipped')}</MenuItem>
                                <MenuItem value="delivered">{t('adminOrderConsole.delivered')}</MenuItem>
                            </Select>
                        </FormControl>
                    </CardContent>
                </Card>
            ))}
            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                    count={Math.ceil(orders.length / limit)}
                    page={page}
                    onChange={handlePageChange}
                />
            </Box>
        </Container>
    );
};

export default AdminOrderConsole;


