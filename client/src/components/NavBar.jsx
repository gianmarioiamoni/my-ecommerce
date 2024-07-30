import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { CartContext } from '../contexts/CartContext';

const NavBar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { cart } = useContext(CartContext);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const list = () => (
        <div
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                <ListItem button component={Link} to="/products">
                    <ListItemText primary="Products" />
                </ListItem>
                <ListItem button component={Link} to="/products/new">
                    <ListItemText primary="Add Product" />
                </ListItem>
                <ListItem button component={Link} to="/products/edit">
                    <ListItemText primary="Edit Product" />
                </ListItem>
                <ListItem button component={Link} to="/manage-categories">
                    <ListItemText primary="Config" />
                </ListItem>
                <ListItem button component={Link} to="/register">
                    <ListItemText primary="Register" />
                </ListItem>
                <ListItem button component={Link} to="/login">
                    <ListItemText primary="Login" />
                </ListItem>
                <ListItem button component={Link} to="/cart">
                    <ListItemText primary={`Cart (${cart.length})`} />
                </ListItem>
            </List>
        </div>
    );

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    E-Commerce
                </Typography>
                {!isMobile && (
                    <div className="nav-buttons">
                        <Button color="inherit" component={Link} to="/products">
                            Products
                        </Button>
                        <Button color="inherit" component={Link} to="/products/new">
                            Add Product
                        </Button>
                        <Button color="inherit" component={Link} to="/products/edit">
                            Edit Products
                        </Button>
                        <Button color="inherit" component={Link} to="/manage-categories">
                            Config
                        </Button>
                        <Button color="inherit" component={Link} to="/register">
                            Register
                        </Button>
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                        <Button color="inherit" component={Link} to="/cart">
                            Cart ({cart.length})
                        </Button>
                    </div>
                )}
                {isMobile && (
                    <IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                )}
                <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                    {list()}
                </Drawer>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
