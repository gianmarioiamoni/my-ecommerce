import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    Tooltip,
    Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { FlagIcon } from 'react-flag-kit';

import './NavBar.css';

/**
 * The navigation bar component
 * 
 * @returns {JSX.Element} The JSX element for the navigation bar
 */
const NavBar = () => {
    // State variables
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [languageMenuOpen, setLanguageMenuOpen] = useState(null);
    const [currentLang, setCurrentLang] = useState();

    // Context variables
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { cart } = useContext(CartContext);
    const { user, logout, updateUserLanguage } = useContext(AuthContext);
    const { t, i18n } = useTranslation();

    // Effects
    useEffect(() => {
        console.log("NavBar - user", user);
        setCurrentLang(user?.language || 'en');
    }, []);

    useEffect(() => {
        if (user?.language) {
            setCurrentLang(user.language);
            console.log("NavBar - user.language", user.language);
            i18n.changeLanguage(user.language);  // Change the current language if it is defined in the context
        } else {
            setCurrentLang('en');
        }
    }, [user]);  // Add user as a dependency, so it is triggered only when the user changes

    useEffect(() => {
        // Set the initial language based on the current language of i18n
        i18n.changeLanguage(user?.language || 'en');
        console.log("NavBar - i18n.language", i18n.language);
        setCurrentLang(i18n.language);
    }, [i18n.language]);

    // Functions
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageMenuOpen = (event) => {
        setLanguageMenuOpen(event.currentTarget);
    };

    const handleLanguageChange = async (lang) => {
        i18n.changeLanguage(lang);
        setCurrentLang(lang); // Update the current language state
        setLanguageMenuOpen(null);
        await updateUserLanguage(lang);
    };

    // Utility functions
    const getFlagCode = (lang) => {
        switch (lang) {
            case 'en':
                return 'GB';
            case 'it':
                return 'IT';
            default:
                return 'GB';
        }
    };

    const renderMenuItems = () => {
        if (user) {
            return (
                <>
                    <ListItem button component={Link} to="/products">
                        <ListItemText primary={t('navBar.products')} />
                    </ListItem>
                    {user.isAdmin && (
                        <>
                            <ListItem button component={Link} to="/products/new">
                                <ListItemText primary={t('navBar.addProduct')} />
                            </ListItem>
                            <ListItem button component={Link} to="/products/edit">
                                <ListItemText primary={t('navBar.editProducts')} />
                            </ListItem>
                        </>
                    )}
                    {!user.isAdmin && (
                        <ListItem button component={Link} to="/cart">
                            <IconButton color="inherit" component={Link} to="/cart">
                                <Badge badgeContent={cart.length} color="secondary">
                                    <ShoppingCartIcon /> 
                                </Badge>
                            </IconButton>
                        </ListItem>
                    )}
                    <ListItem button onClick={logout}>
                        <ListItemText primary={t('navBar.logout')} />
                    </ListItem>
                </>
            );
        } else {
            return (
                <>
                    <ListItem button component={Link} to="/products">
                        <ListItemText primary={t('navBar.products')} />
                    </ListItem>
                    <ListItem button component={Link} to="/login">
                        <ListItemText primary={t('navBar.login')} />
                    </ListItem>
                    <ListItem button component={Link} to="/register">
                        <ListItemText primary={t('navBar.register')} />
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
                {/* Home Icon that links to the root ("/") */}
                <IconButton component={Link} to="/" color="inherit" edge="start">
                    <HomeIcon />
                </IconButton>
                
                {/* Menu Icon that opens the drawer when clicked */}
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
                
                {/* Drawer that contains the menu items when the menu icon is clicked */}
                <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                    {list()}
                </Drawer>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Change Language">
                        <IconButton onClick={handleLanguageMenuOpen} color="inherit">
                            <FlagIcon code={getFlagCode(currentLang)} size={24} />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        anchorEl={languageMenuOpen}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        keepMounted
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={Boolean(languageMenuOpen)}
                        onClose={() => setLanguageMenuOpen(null)}
                    >
                        <MenuItem onClick={() => handleLanguageChange('en')}>
                            <FlagIcon code="GB" size={24} style={{ marginRight: 8 }} />
                            English
                        </MenuItem>
                        <MenuItem onClick={() => handleLanguageChange('it')}>
                            <FlagIcon code="IT" size={24} style={{ marginRight: 8 }} />
                            Italiano
                        </MenuItem>
                    </Menu>
                </div>
                {user && (
                    <div>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                            onClick={handleAvatarClick}>
                            {user.photoUrl ? (
                                <Avatar src={user.photoUrl} alt={user.name || user.email} />
                            ) : (
                                <Avatar>{user && user.name ? user.name.charAt(0) : user.email.charAt(0)}</Avatar>
                            )}
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            PaperProps={{ onClick: handleClose }}
                        >
                            <MenuItem component={Link} to="/profile">{t('navBar.profile')}</MenuItem>
                            {!user.isAdmin ? (
                                <MenuItem component={Link} to="/order-history">{t('navBar.orderHistory')}</MenuItem>
                            ) : (
                                <MenuItem component={Link} to="/admin/orders">{t('navBar.ordersConsole')}</MenuItem>
                            )}
                            {!user.isAdmin ? (
                                <MenuItem component={Link} to="/wishlists">{t('navBar.wishlists')}</MenuItem>
                            ) : (
                                <MenuItem component={Link} to="/manage-categories">{t('navBar.manageCategories')}</MenuItem>
                            )}
                            {user.isAdmin && (
                                <MenuItem component={Link} to="/sales-report">{t('navBar.salesReports')}</MenuItem>
                            )}
                            {user.isAdmin && (
                                <MenuItem component={Link} to="/user-behavior-dashboard">{t('navBar.userBehaviorDashboard')}</MenuItem>
                            )}
                            {user.isAdmin && (
                                <MenuItem component={Link} to="/config">{t('navBar.config')}</MenuItem>
                            )}
                            <MenuItem onClick={logout}>{t('navBar.logout')}</MenuItem>
                        </Menu>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;