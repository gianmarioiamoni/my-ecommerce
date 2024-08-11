import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import { sendPasswordResetEmail } from '../services/usersServices';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(email);
            setSnackbarMessage("Password reset email sent. Please check your inbox.");
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error sending reset email:", error);
            setSnackbarMessage("Failed to send reset email. Please try again.");
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
                    Forgot Password
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField name="email" label="Email" type="email" onChange={handleChange} fullWidth margin="normal" />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Send Reset Email
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

export default ForgotPassword;
