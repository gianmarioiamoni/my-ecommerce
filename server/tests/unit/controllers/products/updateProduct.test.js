import { updateProduct } from '../../../../controllers/products.js';
import Product from '../../../../models/Product.js';
import { mockRequest, mockResponse } from '../../__mocks__/express.js';


jest.mock('../../../../models/Product.js');

describe('updateProduct', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update a product successfully', async () => {
        const req = mockRequest({
            params: { id: '123' },
            body: { name: 'Updated Product' },
        });
        const res = mockResponse();

        Product.findByIdAndUpdate.mockResolvedValue({
            _id: '123',
            name: 'Updated Product',
        });

        await updateProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            _id: '123',
            name: 'Updated Product',
        });
    });

    it('should return 404 if product is not found', async () => {
        const req = mockRequest({
            params: { id: '123' },
            body: { name: 'Updated Product' },
        });
        const res = mockResponse();

        Product.findByIdAndUpdate.mockResolvedValue(null);

        await updateProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });

    it('should return 400 if update fails', async () => {
        const req = mockRequest({
            params: { id: '123' },
            body: { name: 'Updated Product' },
        });
        const res = mockResponse();

        Product.findByIdAndUpdate.mockRejectedValue(new Error('Update failed'));

        await updateProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Update failed' });
    });
});