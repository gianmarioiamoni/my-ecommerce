import Category from '../models/Category.js';


/**
 * Get all categories
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find(); 
        res.status(200).json(categories); 
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
}

/**
 * Create a new category
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
export const createCategory = async (req, res) => {
    const categoryData = req.body;
    const newCategory = new Category(categoryData); 

    try {
        // Save the category in the database
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        // Return a 400 error with the error message
        res.status(400).json({ message: error.message });
    }
}

/**
 * Delete a category by name
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
export const deleteCategory = async (req, res) => {
    try {
        // Attempt to delete the category from the database
        const deletedCategory = await Category.findOneAndDelete({ name: req.params.name });
        // If the category is not found, return a 404 error
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        // Return a 200 OK response with a message indicating that the category was deleted successfully
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        // Return a 500 error with the error message
        res.status(500).json({ message: error.message });
    }
}

/**
 * Update a category by name
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
export const updateCategory = async (req, res) => {
    try {
        // Attempt to update the category in the database
        const updatedCategory = await Category.findOneAndUpdate(
            { name: req.params.name },
            req.body,
            {
                new: true, // Return the updated category
            }
        );
        // If the category is not found, return a 404 error
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        // Return a 200 OK response with the updated category
        res.status(200).json(updatedCategory);
    } catch (error) {
        // Return a 400 error with the error message
        res.status(400).json({ message: error.message });
    }
}
