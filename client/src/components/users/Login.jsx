import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TextField, Button, Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';

/**
 * Login component
 * 
 * @returns {ReactElement} The login form
 */
const Login = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const { login } = useContext(AuthContext);

    const navigate = useNavigate();

    /**
     * Handles changes in the form data
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
     */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /**
     * Handles the form submission
     * 
     * @param {React.FormEvent<HTMLFormElement>} e - The form event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
            setSnackbarMessage(t('login.successMessage'));
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            navigate('/products');
        } catch (error) {
            console.error("Login error:", error);
            setSnackbarMessage(t('login.errorMessage'));
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
                    {t('login.title')}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        name="email"
                        label={t('login.emailLabel')}
                        type="email"
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="password"
                        label={t('login.passwordLabel')}
                        type="password"
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        {t('login.button')}
                    </Button>
                </form>
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    {t('login.registerPrompt')} <Link to="/register">{t('login.registerLink')}</Link>
                </Typography>
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    {t('login.forgotPasswordPrompt')} <Link to="/forgot-password">{t('login.forgotPasswordLink')}</Link>
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

export default Login;
