// components/users/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const { login } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
            setSnackbarMessage("User login successful!");
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            navigate('/products');
        } catch (error) {
            setSnackbarMessage("Login failed. Please check your credentials.");
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
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField name="email" label="Email" type="email" onChange={handleChange} fullWidth margin="normal" />
                    <TextField name="password" label="Password" type="password" onChange={handleChange} fullWidth margin="normal" />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Login
                    </Button>
                </form>
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Don't have an account? <Link to="/register">Register</Link>
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
