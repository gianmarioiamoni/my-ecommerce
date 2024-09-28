import { updateCategory } from '../../../../controllers/categories.js';
import Category from '../../../../models/Category.js';  // Category Model

jest.mock('../../../../models/Category.js');  // Simuliamo il model Category

describe('updateCategory controller', () => {

    let req, res;

    beforeEach(() => {
        req = {
            params: { name: 'existingCategory' },
            body: { name: 'updatedCategory' }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update the category and return a 200 status with the updated category', async () => {
        // Mocking findOneAndUpdate to return a category object
        const updatedCategory = { name: 'updatedCategory' };
        Category.findOneAndUpdate.mockResolvedValue(updatedCategory);

        await updateCategory(req, res);

        // Expect findOneAndUpdate to have been called with correct parameters
        expect(Category.findOneAndUpdate).toHaveBeenCalledWith(
            { name: 'existingCategory' },
            req.body,
            { new: true }
        );

        // Expect response status to be 200 and return updated category
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updatedCategory);
    });

    it('should return a 404 if the category is not found', async () => {
        // Mocking findOneAndUpdate to return null (category not found)
        Category.findOneAndUpdate.mockResolvedValue(null);

        await updateCategory(req, res);

        // Expect status to be 404 and return the 'Category not found' message
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Category not found' });
    });

    it('should return a 400 if there is an error during the update', async () => {
        // Mocking findOneAndUpdate to throw an error
        const error = new Error('Database error');
        Category.findOneAndUpdate.mockRejectedValue(error);

        await updateCategory(req, res);

        // Expect status to be 400 and return the error message
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
});
