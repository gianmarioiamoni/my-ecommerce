import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { Container, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);

    const getTotal = () => {
        return cart.reduce((total, product) => total + product.price, 0).toFixed(2);
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Shopping Cart
            </Typography>
            <List>
                {cart.map((product) => (
                    <ListItem key={product._id}>
                        <ListItemText
                            primary={product.name}
                            secondary={`$${product.price}`}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(product.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <Typography variant="h6" component="h2">
                Total: ${getTotal()}
            </Typography>
            <Button variant="contained" color="primary" onClick={clearCart} style={{ marginRight: '10px' }}>
                Clear Cart
            </Button>
            <Button
                variant="contained"
                color="secondary"
                component={Link}
                to="/checkout"
            >
                Proceed to Checkout
            </Button>
        </Container>
    );
};

export default Cart;
