import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Container, Grid, Card, CardContent, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { getAllProducts, deleteProduct } from '../services/productsServices';

const ProductsEdit = () => {
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const products = await getAllProducts();
                setProducts(products);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (productId) => {
        try {
            await deleteProduct(productId);
            setProducts(products.filter(product => product._id !== productId));
        } catch (error) {
            console.error(error);
        }
    };

    const handleClickOpen = (productId) => {
        setProductToDelete(productId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setProductToDelete(null);
    };

    const handleConfirmDelete = () => {
        handleDelete(productToDelete);
        handleClose();
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Edit Products
            </Typography>
            <Grid container spacing={4}>
                {products.map((product) => (
                    <Grid item key={product._id} xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {product.description}
                                </Typography>
                                <Typography variant="h6">
                                    ${product.price}
                                </Typography>
                                <IconButton component={Link} to={`/products/edit/${product._id}`} color="primary">
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="secondary" onClick={() => handleClickOpen(product._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this product?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProductsEdit;
