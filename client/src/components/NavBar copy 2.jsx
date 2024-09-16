import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { FlagIcon } from 'react-flag-kit';

import './NavBar.css';

const NavBar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [languageMenuOpen, setLanguageMenuOpen] = useState(null);
    const [currentLang, setCurrentLang] = useState();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { cart } = useContext(CartContext);
    const { user, logout, updateUserLanguage } = useContext(AuthContext);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        console.log("NavBar - user", user);
        setCurrentLang(user?.language || 'en');
    }, []);

    useEffect(() => {
        if (user?.language) {
            setCurrentLang(user.language);
            console.log("NavBar - user.language", user.language);
            i18n.changeLanguage(user.language);  // Cambia la lingua attuale solo se definita nel contesto
        } else {
            setCurrentLang('en');
        }
    }, [user]);  // Aggiungi user come dipendenza, così si attiva solo al cambio di utente.

    useEffect(() => {
        // Imposta la lingua iniziale in base alla lingua corrente di i18n
        i18n.changeLanguage(user?.language || 'en');
        console.log("NavBar - i18n.language", i18n.language);
        setCurrentLang(i18n.language);
    }, [i18n.language]);

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
        setCurrentLang(lang); // update the current language state
        setLanguageMenuOpen(null);
        await updateUserLanguage(lang);
    };


    // Define the flag code for each language
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
                            <ListItem button component={Link} to="/sales-reports">
                                <ListItemText primary={t('navBar.salesReports')} />
                            </ListItem>
                            <ListItem button component={Link} to="/user-behavior-dashboard">
                                <ListItemText primary={t('navBar.userBehaviorDashboard')} />
                            </ListItem>
                            <ListItem button component={Link} to="/manage-categories">
                                <ListItemText primary={t('navBar.config')} />
                            </ListItem>
                        </>
                    )}
                    {!user.isAdmin && (
                        <ListItem button component={Link} to="/cart">
                            <ListItemText primary={t('navBar.cart') + ` (${cart.length})`} />
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
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    {t('navBar.title')}
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
                            <MenuItem onClick={logout}>{t('navBar.logout')}</MenuItem>
                        </Menu>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;