import React, { useState } from 'react';
import { Container, TextField, Button, Typography, List, ListItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCategories } from '../../contexts/CategoriesContext';

import { useTranslation } from 'react-i18next';

const ManageCategories = () => {
    const { categories, addCategory, deleteCategory, updateCategory } = useCategories();
    const [newCategory, setNewCategory] = useState('');

    const { t, i18n } = useTranslation();

    const handleAddCategory = () => {
        if (newCategory.trim() && !categories.includes(newCategory.trim())) {
            addCategory(newCategory.trim());
            setNewCategory('');
        }
    };

    const handleRemoveCategory = (categoryToRemove) => {
        deleteCategory(categoryToRemove);
    };

    const handleCategoryChange = (index, newCategoryName) => {
        const oldCategory = categories[index];
        updateCategory(oldCategory, newCategoryName);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                {t('categories.manageCategories')}
            </Typography>
            <TextField
                label={t('categories.newCategory')}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleAddCategory} style={{ marginBottom: '20px' }}>
                {t('categories.addCategory')}
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

