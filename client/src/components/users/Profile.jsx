import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import { uploadProfilePicture } from '../../services/usersServices';

const Profile = () => {
    const { user, update, remove } = useContext(AuthContext);
    const [formData, setFormData] = useState({ name: user.name, email: user.email, currentPassword: '', newPassword: '' });
    const [addresses, setAddresses] = useState(user.addresses || []);
    const [paymentMethods, setPaymentMethods] = useState(user.paymentMethods || []);
    const [newAddress, setNewAddress] = useState('');
    const [newPaymentMethod, setNewPaymentMethod] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const navigate = useNavigate();

    useEffect(() => {
        setFormData({ name: user.name, email: user.email, currentPassword: '', newPassword: '' });
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


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
            setSnackbarMessage("Profile updated successfully!");
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage("Profile update failed. Please try again.");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await uploadProfilePicture(formData);
            const photoUrl = response.url;
            await update({ photoUrl });
            setSnackbarMessage("Profile picture updated successfully!");
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage("Profile picture update failed. Please try again.");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await remove();
            setSnackbarMessage("Account deleted successfully!");
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            navigate('/');
        } catch (error) {
            setSnackbarMessage("Account deletion failed. Please try again.");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

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
                    Profile
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        name="name"
                        label="Name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="currentPassword"
                        label="Current Password"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="newPassword"
                        label="New Password"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <Link to="/manage-addresses-payments">
                        Manage Shipping Addresses and Payment Methods
                    </Link>
                    
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={!isFormValid}
                        sx={{ mt: 4 }}
                    >
                        Update Profile
                    </Button>
                </form>
                <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Upload Profile Picture
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
                        Delete Account
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
