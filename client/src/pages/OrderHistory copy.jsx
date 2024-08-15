import React, { useEffect, useState, useContext } from 'react';

import { Container, Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';

import { AuthContext } from '../contexts/AuthContext';

import { getOrderHistory } from '../services/ordersServices';

const OrderHistory = ({ userId }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const response = await getOrderHistory(user.id);
                setOrders(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching order history:', error);
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, [userId]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Order History
            </Typography>
            <Grid container spacing={4}>
                {orders.map((order) => (
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
                ))}
            </Grid>
        </Container>
    );
};

export default OrderHistory;
