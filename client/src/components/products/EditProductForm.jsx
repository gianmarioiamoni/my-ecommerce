import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, TextField, Button, Typography } from '@mui/material';
import { getProductById, updateProduct } from '../../services/productsServices';

const EditProductForm = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        imageUrls: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const product = await getProductById(id);
                setProduct(product);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProduct(id, product);
            // Redirect or show a success message
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Edit Product
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Description"
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Price"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Image URLs"
                    name="imageUrls"
                    value={product.imageUrls.join(', ')}
                    onChange={(e) => setProduct({ ...product, imageUrls: e.target.value.split(', ') })}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary">
                    Save Changes
                </Button>
            </form>
        </Container>
    );
};

export default EditProductForm;
