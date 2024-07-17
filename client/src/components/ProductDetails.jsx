import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardMedia } from '@mui/material';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get(`http://localhost:5000/products/${id}`);
            setProduct(data);
        };

        fetchData();
    }, [id]);

    return (
        <Container>
            <Card>
                <CardMedia
                    component="img"
                    alt={product.name}
                    height="400"
                    image={product.imageUrl}
                    title={product.name}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {product.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {product.description}
                    </Typography>
                    <Typography variant="h6">
                        ${product.price}
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
};

export default ProductDetails;

