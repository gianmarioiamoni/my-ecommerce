import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import { resetPassword } from '../../services/usersServices';
import { useTranslation } from 'react-i18next';

/**
 * A component that renders a form to reset the user's password.
 * This component is used by the forgot password feature.
 * @returns {JSX.Element} The component element.
 */
const ResetPassword = () => {
    const { token } = useParams(); // Get the token from the URL parameters
    const [password, setPassword] = useState(''); // State to store the new password
    const [confirmPassword, setConfirmPassword] = useState(''); // State to store the confirm password
    const [snackbarOpen, setSnackbarOpen] = useState(false); // State to store whether the snackbar is open or not
    const [snackbarMessage, setSnackbarMessage] = useState(''); // State to store the message to display in the snackbar
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // State to store the severity of the snackbar
    const navigate = useNavigate(); // Hook to navigate to another page
    const { t } = useTranslation(); // Hook to translate the strings

    /**
     * Handles the change of the password fields.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
     */
    const handleChange = (e) => {
        if (e.target.name === 'password') {
            setPassword(e.target.value);
        } else {
            setConfirmPassword(e.target.value);
        }
    };

    /**
     * Handles the form submission.
     * @param {React.FormEvent<HTMLFormElement>} e - The form event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setSnackbarMessage(t('resetPassword.passwordMismatch'));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        try {
            await resetPassword(token, password);
            setSnackbarMessage(t('resetPassword.resetSuccess'));
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            navigate('/login');
        } catch (error) {
            console.error("Error resetting password:", error);
            setSnackbarMessage(t('resetPassword.resetFailed'));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    /**
     * Handles the snackbar close event.
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
                    {t('resetPassword.title')}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        name="password"
                        label={t('resetPassword.newPassword')}
                        type="password"
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="confirmPassword"
                        label={t('resetPassword.confirmPassword')}
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
                        {t('resetPassword.resetButton')}
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

