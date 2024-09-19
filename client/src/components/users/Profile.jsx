import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import { uploadProfilePicture } from '../../services/usersServices';
import { useTranslation } from 'react-i18next';

/**
 * Component to show and update user profile information.
 *
 * @returns {JSX.Element}
 */
const Profile = () => {
    const { user, update, remove } = useContext(AuthContext);
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        currentPassword: '',
        newPassword: '',
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const navigate = useNavigate();

    useEffect(() => {
        // Reset the form data when the user changes
        setFormData({
            name: user.name,
            email: user.email,
            currentPassword: '',
            newPassword: '',
        });
    }, [user]);

    /**
     * Handles changes to the form data
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
            const updateData = {
                name: formData.name,
                email: formData.email,
            };
            if (formData.newPassword) {
                updateData.password = formData.newPassword;
            }
            await update(updateData, formData.currentPassword);
            setSnackbarMessage(t('profile.snackbarUpdateSuccess'));
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage(t('profile.snackbarUpdateError'));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    /**
     * Handles changes to the user's profile picture
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
     */
    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await uploadProfilePicture(formData);
            const photoUrl = response.url;
            await update({ photoUrl });
            setSnackbarMessage(t('profile.snackbarPictureUpdateSuccess'));
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage(t('profile.snackbarPictureUpdateError'));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    /**
     * Handles the deletion of the user account
     */
    const handleDeleteAccount = async () => {
        try {
            await remove();
            setSnackbarMessage(t('profile.snackbarDeleteSuccess'));
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            navigate('/');
        } catch (error) {
            setSnackbarMessage(t('profile.snackbarDeleteError'));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    /**
     * Handles the closure of the snackbar
     */
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    /**
     * Checks if the form data is valid
     */
    const isFormValid = formData.name && formData.email && formData.currentPassword;

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
                    {t('profile.title')}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        name="name"
                        label={t('profile.name')}
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="email"
                        label={t('profile.email')}
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="currentPassword"
                        label={t('profile.currentPassword')}
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="newPassword"
                        label={t('profile.newPassword')}
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    {!user.isAdmin && (
                        <Link to="/manage-addresses-payments">
                            {t('profile.manageAddresses')}
                        </Link>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={!isFormValid}
                        sx={{ mt: 4 }}
                    >
                        {t('profile.updateProfile')}
                    </Button>
                </form>
                <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    {t('profile.uploadPicture')}
                    <input
                        type="file"
                        hidden
                        onChange={handleProfilePictureChange}
                    />
                </Button>
                {!user.isAdmin && (
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={handleDeleteAccount}
                    >
                        {t('profile.deleteAccount')}
                    </Button>
                )}
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

export default Profile;
