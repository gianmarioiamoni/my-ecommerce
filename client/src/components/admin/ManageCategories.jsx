import React, { useState } from 'react';
import { Container, TextField, Button, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCategories } from '../../contexts/CategoriesContext';

const ManageCategories = () => {
    const { categories, setCategories } = useCategories();
    const [newCategory, setNewCategory] = useState('');

    const handleAddCategory = () => {
        if (newCategory.trim() && !categories.includes(newCategory.trim())) {
            setCategories([...categories, newCategory.trim()]);
            setNewCategory('');
        }
    };

    const handleRemoveCategory = (categoryToRemove) => {
        setCategories(categories.filter(category => category !== categoryToRemove));
    };

    const handleCategoryChange = (index, newCategoryName) => {
        const updatedCategories = [...categories];
        updatedCategories[index] = newCategoryName;
        setCategories(updatedCategories);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Manage Categories
            </Typography>
            <TextField
                label="New Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleAddCategory} style={{ marginBottom: '20px' }}>
                Add Category
            </Button>
            <List>
                {categories.map((category, index) => (
                    <ListItem key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            value={category}
                            onChange={(e) => handleCategoryChange(index, e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <IconButton onClick={() => handleRemoveCategory(category)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default ManageCategories;
