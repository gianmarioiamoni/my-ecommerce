import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    E-Commerce
                </Typography>
                <Button color="inherit" component={Link} to="/products">
                    Products
                </Button>
                <Button color="inherit" component={Link} to="/products/new">
                    Add Product
                </Button>
                <Button color="inherit" component={Link} to="/register">
                    Register
                </Button>
                <Button color="inherit" component={Link} to="/login">
                    Login
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
