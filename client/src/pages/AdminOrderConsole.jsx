import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CircularProgress, MenuItem, Select, FormControl, Button } from '@mui/material';
import { getAllOrders, updateOrderStatus } from '../services/ordersServices';

const AdminOrderConsole = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await getAllOrders();

                // Controlla che data sia un array
                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    console.error('Unexpected data format:', data);
                    setOrders([]);
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

    if (loading) {
        return <CircularProgress />;
    }

    // Aggiungi un controllo per assicurarti che `orders` sia un array
    if (!Array.isArray(orders)) {
        return <Typography variant="body1">Error loading orders. Please try again later.</Typography>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Admin Order Console
            </Typography>
            <Grid container spacing={3}>
                {orders.map((order) => (
                    <Grid item xs={12} key={order._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Order ID: {order._id}</Typography>
                                <Typography variant="body1">Total Amount: ${order.totalAmount}</Typography>
                                <Typography variant="body2">Order Date: {new Date(order.createdAt).toLocaleDateString()}</Typography>
                                <Typography variant="body2">User: {order.userId.name} ({order.userId.email})</Typography>
                                <Typography variant="body2">Status: {order.status}</Typography>

                                <FormControl fullWidth sx={{ mt: 2 }}>
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
        </Container>
    );
};

export default AdminOrderConsole;

