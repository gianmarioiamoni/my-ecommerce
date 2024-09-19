import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next'; // Import for translations
import { sendPasswordResetEmail } from '../../services/usersServices';

/**
 * ForgotPassword component
 * 
 * This component renders a form to enter an email address
 * and sends a password reset email if the user exists.
 * 
 * @returns {ReactElement} The JSX element for the ForgotPassword component
 */
const ForgotPassword = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState(''); // The email address entered by the user
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Whether the snackbar is open or not
    const [snackbarMessage, setSnackbarMessage] = useState(''); // The message to display in the snackbar
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // The severity of the snackbar message

    /**
     * Handles changes to the email input field
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
     */
    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    /**
     * Handles the form submission
     * @param {React.FormEvent<HTMLFormElement>} e - The form event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send the password reset email
            await sendPasswordResetEmail(email);
            // Display a success message in the snackbar
            setSnackbarMessage(t('forgotPassword.successMessage'));
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error("forgotPassword: Error sending reset email:", error);
            // Display an error message in the snackbar
            setSnackbarMessage(t('forgotPassword.errorMessage'));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    /**
     * Handles the close of the snackbar
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
                    {t('forgotPassword.title')}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        name="email"
                        label={t('forgotPassword.emailLabel')}
                        type="email"
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        {t('forgotPassword.submitButton')}
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

