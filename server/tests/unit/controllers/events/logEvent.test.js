import { logEvent } from '../../../../controllers/events.js';
import Event from '../../../../models/Event.js';

jest.mock('../../../../models/Event.js');

describe('logEvent controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                userId: 'user123',
                eventType: 'click',
                productId: 'product456',
                metadata: { info: 'extra info' },
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should save a new event and return a 201 status', async () => {
        const mockEvent = { ...req.body, _id: 'event789', timestamp: new Date() };
        Event.prototype.save = jest.fn().mockResolvedValue(mockEvent);

        await logEvent(req, res);

        expect(Event.prototype.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockEvent);
    });

    it('should return a 500 error if there is an internal server error', async () => {
        Event.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

        await logEvent(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error in logEvent' });
    });
});
