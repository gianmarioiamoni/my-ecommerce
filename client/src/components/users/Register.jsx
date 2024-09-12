import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const serverURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const { login } = useContext(AuthContext);
    const { t } = useTranslation();

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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

