// components/users/Register.js
import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const serverURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
            const { data } = await axios.post(`${serverURL}/users/register`, formData);
            setSnackbarMessage("User registration successful!");
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            // Autenticare l'utente dopo la registrazione
            await login({ email: formData.email, password: formData.password });
            navigate('/products');
        } catch (error) {
            setSnackbarMessage("Registration failed. Please try again.");
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
                    Register
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField name="name" label="Name" onChange={handleChange} fullWidth margin="normal" />
                    <TextField name="email" label="Email" type="email" onChange={handleChange} fullWidth margin="normal" />
                    <TextField name="password" label="Password" type="password" onChange={handleChange} fullWidth margin="normal" />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Register
                    </Button>
                </form>
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Already have an account? <Link to="/login">Login</Link>
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
