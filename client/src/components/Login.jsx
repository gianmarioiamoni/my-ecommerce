// Login.js
import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';

const serverURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
console.log("serverURL", serverURL);

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${serverURL}/users/login`, formData);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <Typography variant="h4">Login</Typography>
            <form onSubmit={handleSubmit}>
                <TextField name="email" label="Email" type="email" onChange={handleChange} fullWidth margin="normal" />
                <TextField name="password" label="Password" type="password" onChange={handleChange} fullWidth margin="normal" />
                <Button type="submit" variant="contained" color="primary">Login</Button>
            </form>
        </Container>
    );
};

export default Login;
