// Quando l'utente clicca sul link di reset della password, verrà reindirizzato a una pagina dove potrà inserire una nuova password. Creiamo un nuovo componente `ResetPassword.js` per gestire questa funzionalità.

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import { resetPassword } from '../../services/usersServices';

const ResetPassword = () => {
    const { token } = useParams(); // Ottieni il token dalla URL
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.name === 'password') {
            setPassword(e.target.value);
        } else {
            setConfirmPassword(e.target.value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setSnackbarMessage("Passwords do not match.");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        try {
            await resetPassword(token, password);
            setSnackbarMessage("Password reset successful. You can now login with your new password.");
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            navigate('/login');
        } catch (error) {
            console.error("Error resetting password:", error);
            setSnackbarMessage("Failed to reset password. Please try again.");
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
                    Reset Password
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField name="password" label="New Password" type="password" onChange={handleChange} fullWidth margin="normal" />
                    <TextField name="confirmPassword" label="Confirm New Password" type="password" onChange={handleChange} fullWidth margin="normal" />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Reset Password
                    </Button>
                </form>
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

export default ResetPassword;
