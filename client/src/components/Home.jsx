// simple Homepage with to links to Login and Register routes

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home">
            <h1>Welcome to My Ecommerce</h1>
            <Link to="/login">Login</Link>
            <br />
            <Link to="/register">Register</Link>
        </div>
    );
};

export default Home;