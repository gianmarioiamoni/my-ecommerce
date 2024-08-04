import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List, ListItem, ListItemText,
    Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';

const NavBar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { cart } = useContext(CartContext);
    const { user, logout } = useContext(AuthContext);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const renderMenuItems = () => {
        if (user) {
            return (
                <>
                    <ListItem button component={Link} to="/products">
                        <ListItemText primary="Products" />
                    </ListItem>
                    {user.isAdmin && (
                        <>
                            <ListItem button component={Link} to="/products/new">
                                <ListItemText primary="Add Product" />
                            </ListItem>
                            <ListItem button component={Link} to="/products/edit">
                                <ListItemText primary="Edit Products" />
                            </ListItem>
                            <ListItem button component={Link} to="/manage-categories">
                                <ListItemText primary="Config" />
                            </ListItem>
                        </>
                    )}
                    {!user.isAdmin && (
                    <ListItem button component={Link} to="/cart">
                        <ListItemText primary={`Cart (${cart.length})`} />
                    </ListItem>
                    )}
                    <ListItem button onClick={logout}>
                        <ListItemText primary="Logout" />
                    </ListItem>
                    <ListItem>
                        <IconButton>
                            {user.photoUrl ? (
                                <Avatar src={user.photoUrl} alt={user.name || user.email} />
                            ) : (
                                <Avatar>{user.name ? user.name.charAt(0) : user.email.charAt(0)}</Avatar>
                            )}
                        </IconButton>
                    </ListItem>
                </>
            );
        } else {
            return (
                <>
                    <ListItem button component={Link} to="/products">
                        <ListItemText primary="Products" />
                    </ListItem>
                    <ListItem button component={Link} to="/login">
                        <ListItemText primary="Login" />
                    </ListItem>
                    <ListItem button component={Link} to="/register">
                        <ListItemText primary="Register" />
                    </ListItem>
                </>
            );
        }
    };

    const list = () => (
        <div
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {renderMenuItems()}
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
                        {renderMenuItems()}
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


