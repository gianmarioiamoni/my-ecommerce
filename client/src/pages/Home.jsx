import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

/**
 * The HomePage component is the main entry point of the application.
 * It displays a welcome message and a button to view the products.
 * If the user is not logged in, it also displays a button to login
 * and a link to register.
 */
const HomePage = () => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage: 'url(/background.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',

            }}
        >
            {/* The overlay is used to darken the background image */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Opacity 50%
                    backdropFilter: 'blur(3px)', // Blur effect
                    zIndex: 1,
                }}
            />

            {/* The content is displayed on top of the overlay */}
            <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#fff' }}>
                <Typography variant="h3" gutterBottom>
                    {/* Display a welcome message based on whether the user is logged in or not */}
                    {user ? `${t('homepage.welcome')}, ${user.name}!` : t('homepage.welcomeGuest')}
                </Typography>
                <Typography variant="h5" gutterBottom>
                    {/* Display the slogan of the application */}
                    {t('homepage.slogan')}
                </Typography>

                <Box sx={{ mt: 3 }}>
                    {/* Display a button to view the products */}
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        component={Link}
                        to="/products"
                        sx={{ mr: 2 }}
                    >
                        {/* Display the text to view the products */}
                        {t('homepage.viewProducts')}
                    </Button>

                    {/* If the user is not logged in, display a button to login and a link to register */}
                    {!user && (
                        <>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                component={Link}
                                to="/login"
                                sx={{ mr: 2 }}
                            >
                                {/* Display the text to login */}
                                {t('homepage.login')}
                            </Button>
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                {/* Display the text to register if the user does not have an account */}
                                {t('homepage.noAccount')}{' '}
                                <Link to="/register" style={{ color: '#fff', textDecoration: 'underline' }}>
                                    {/* Display the text to register */}
                                    {t('homepage.register')}
                                </Link>
                            </Typography>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default HomePage;
