import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const serverURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

/**
 * Component to handle user registration.
 *
 * @returns {ReactElement} The registration form
 */
const Register = () => {
    /**
     * State to store the form data
     */
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    /**
     * State to store the snackbar data
     */
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    /**
     * Context to access the login function
     */
    const { login } = useContext(AuthContext);

    /**
     * Hook to access the translated strings
     */
    const { t } = useTranslation();

    /**
     * Hook to access the navigate function
     */
    const navigate = useNavigate();

    /**
     * Handles changes in the form data
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
     */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /**
     * Handles the form submission
     * @param {React.FormEvent<HTMLFormElement>} e - The form event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${serverURL}/users/register`, formData);
            setSnackbarMessage(t('register.snackbarSuccess'));
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            // Autenticare l'utente dopo la registrazione
            await login({ email: formData.email, password: formData.password });
            navigate('/products');
        } catch (error) {
            setSnackbarMessage(t('register.snackbarError'));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    /**
     * Handles the snackbar close event
     */
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container>
            <Box
                sx={{
                    width: { xs: '90%', sm: '70%', md: '50%', lg: '40%' },
                    margin: 'auto',
                    mt: 4
                }}
            >
                <Typography variant="h4" align="center" gutterBottom>
                    {t('register.title')}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        name="name"
                        label={t('register.name')}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="email"
                        label={t('register.email')}
                        type="email"
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="password"
                        label={t('register.password')}
                        type="password"
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        {t('register.register')}
                    </Button>
                </form>
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    {t('register.alreadyHaveAccount')} <Link to="/login">{t('register.login')}</Link>
                </Typography>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Register;

