// Register.js
import React, { useState } from 'react';

import { TextField, Button, Container, Typography } from '@mui/material';

import axios from 'axios';

const serverURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
console.log("serverURL", serverURL);

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // usare axios.post su /users/register utilizzando serverURL
            // const { data } = await axios.post('http://localhost:5000/users/register', formData);
            const { data } = await axios.post(`${serverURL}/users/register`, formData);
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <Typography variant="h4">Register</Typography>
            <form onSubmit={handleSubmit}>
                <TextField name="name" label="Name" onChange={handleChange} fullWidth margin="normal" />
                <TextField name="email" label="Email" type="email" onChange={handleChange} fullWidth margin="normal" />
                <TextField name="password" label="Password" type="password" onChange={handleChange} fullWidth margin="normal" />
                <Button type="submit" variant="contained" color="primary">Register</Button>
            </form>
        </Container>
    );
};

export default Register;