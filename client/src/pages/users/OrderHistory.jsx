import React, { useEffect, useState, useContext } from 'react';
import { useQuery } from 'react-query';

import {
    Container,
    Typography,
    Grid,
    Card, CardContent,
    CircularProgress,
    TextField,
    MenuItem, Select,
    InputLabel, FormControl,
    Box,
    Pagination,
    Avatar
} from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import { getOrderHistory } from '../../services/ordersServices';
import { useTranslation } from 'react-i18next';

/**
 * Component to display the order history of a user.
 * 
 * @returns {React.ReactElement} - The rendered component
 */
const OrderHistory = () => {
    const { t } = useTranslation(); // Get the translation function
    const { user } = useContext(AuthContext); // Get the user from the auth context
    const [displayedOrders, setDisplayedOrders] = useState([]); // The list of orders to display
    const [page, setPage] = useState(1); // The current page
    const [limit, setLimit] = useState(10); // The number of orders per page
    const [sort, setSort] = useState('createdAt'); // The sort field
    const [order, setOrder] = useState('desc'); // The sort order
    const [search, setSearch] = useState(''); // The search string
    const [startDate, setStartDate] = useState(''); // The start date of the date range
    const [endDate, setEndDate] = useState(''); // The end date of the date range
    const [statusFilter, setStatusFilter] = useState(''); // The status filter

    // Fetch the order history
    const { data, error, isLoading } = useQuery(
        ['orderHistory', user.id, page, limit, sort, order, search, startDate, endDate], // Unique key
        () => getOrderHistory(user.id, { page, limit, sort, order, search, startDate, endDate }), // fetching function
        {
            keepPreviousData: true, // Maintain the previous data when the page changes 
        }
    );

    // If the data is loading, extract the orders
    const allOrders = data?.orders || [];

    useEffect(() => {
        /**
         * Filters the orders based on the search string, date range and status filter.
         * Sorts the orders based on the sort field and order.
         * Sets the displayed orders to the filtered and sorted orders.
         */
        let filteredOrders = allOrders;

        if (search) {
            console.log("search:", search)
            filteredOrders = filteredOrders.filter(order =>
                // order.products.some(item => item.product.name.toLowerCase().includes(search.toLowerCase()))
                order.products.some(p => {
                    console.log("p.product.name:", p.product.name)
                    console.log("p.product.name.toLowerCase().includes(search.toLowerCase()):", p.product.name.toLowerCase().includes(search.toLowerCase()))
                    return p.product.name.toLowerCase().includes(search.toLowerCase())
                })
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

        if (statusFilter) {
            filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
        }

        filteredOrders = filteredOrders.sort((a, b) => {
            const aValue = a[sort];
            const bValue = b[sort];
            if (aValue < bValue) return order === 'asc' ? -1 : 1;
            if (aValue > bValue) return order === 'asc' ? 1 : -1;
            return 0;
        });

        setDisplayedOrders(filteredOrders.slice((page - 1) * limit, page * limit));
    }, [allOrders, search, startDate, endDate, sort, order, statusFilter, page, limit]);

    const handlePageChange = (event, value) => {
        /**
         * Handles the page change event.
         * Sets the page to the new value.
         */
        setPage(value);
    };

    const handleSearch = (e) => {
        /**
         * Handles the search event.
         * Sets the search string to the new value and resets the page to 1.
         */
        setSearch(e.target.value);
        setPage(1);
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                {t('orderHistory.title')}
            </Typography>

            <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={3}>
                    <TextField
                        label={t('orderHistory.search')}
                        variant="outlined"
                        fullWidth
                        value={search}
                        onChange={handleSearch}
                    />
                </Grid>
                <Grid item xs={6} md={2}>
                    <FormControl fullWidth>
                        <InputLabel>{t('orderHistory.sortBy')}</InputLabel>
                        <Select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            label={t('orderHistory.sortBy')}
                        >
                            <MenuItem value="createdAt">{t('orderHistory.date')}</MenuItem>
                            <MenuItem value="totalAmount">{t('orderHistory.amount')}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={2}>
                    <FormControl fullWidth>
                        <InputLabel>{t('orderHistory.order')}</InputLabel>
                        <Select
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            label={t('orderHistory.order')}
                        >
                            <MenuItem value="asc">{t('orderHistory.ascending')}</MenuItem>
                            <MenuItem value="desc">{t('orderHistory.descending')}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={2}>
                    <TextField
                        label={t('orderHistory.startDate')}
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6} md={2}>
                    <TextField
                        label={t('orderHistory.endDate')}
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={3}> {/* Nuovo filtro per stato */}
                    <FormControl fullWidth>
                        <InputLabel>{t('orderHistory.status')}</InputLabel>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            label={t('orderHistory.status')}
                        >
                            <MenuItem value="">{t('orderHistory.all')}</MenuItem>
                            <MenuItem value="In Progress">{t('orderHistory.inProgress')}</MenuItem>
                            <MenuItem value="Shipped">{t('orderHistory.shipped')}</MenuItem>
                            <MenuItem value="Delivered">{t('orderHistory.delivered')}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 3 }}>
                {displayedOrders.length > 0 ? (
                    displayedOrders.map((order) => (
                        <Grid item xs={12} sm={6} md={4} key={order._id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6">{t('orderHistory.orderId')}: {order._id}</Typography>
                                    <Typography variant="body1">{t('orderHistory.totalAmount')}: ${order.totalAmount}</Typography>
                                    <Typography variant="body2">{t('orderHistory.orderDate')}: {new Date(order.createdAt).toLocaleDateString()}</Typography>
                                    <Typography variant="body2">{t('orderHistory.status')}: {order.status}</Typography>
                                    <Typography variant="body2" gutterBottom>{t('orderHistory.products')}:</Typography>
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
                                                {item.product.name} - {t('orderHistory.quantity')}: {item.quantity}
                                            </Box>
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="body1" align="center">{t('orderHistory.noOrders')}</Typography>
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





