import React, { useState } from 'react';
import { Container, TextField, Button, Typography, List, ListItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCategories } from '../../contexts/CategoriesContext';

import { useTranslation } from 'react-i18next';

/**
 * The ManageCategories component is used to manage the categories of the products.
 * It has a text field for adding new categories and a list of the existing categories.
 * Each item in the list is a text field for editing the category name and a delete button.
 * The component uses the useCategories hook to manage the categories.
 * The component also uses the useTranslation hook to translate the text.
 */
const ManageCategories = () => {
    const { categories, addCategory, deleteCategory, updateCategory } = useCategories();
    const [newCategory, setNewCategory] = useState('');

    const { t, i18n } = useTranslation();

    /**
     * Handles adding a new category.
     */
    const handleAddCategory = () => {
        if (newCategory.trim() && !categories.includes(newCategory.trim())) {
            addCategory(newCategory.trim());
            setNewCategory('');
        }
    };

    /**
     * Handles removing a category.
     * @param {string} categoryToRemove The category to remove.
     */
    const handleRemoveCategory = (categoryToRemove) => {
        deleteCategory(categoryToRemove);
    };

    /**
     * Handles changing a category name.
     * @param {number} index The index of the category in the categories array.
     * @param {string} newCategoryName The new category name.
     */
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

