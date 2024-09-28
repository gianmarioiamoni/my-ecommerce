import { getEvents } from '../../../../controllers/events.js';
import Event from '../../../../models/Event.js';

jest.mock('../../../../models/Event.js');

describe('getEvents controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            query: { startDate: '2023-01-01', endDate: '2023-12-31' },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a 200 status and the list of events when valid dates are provided', async () => {
        const mockEvents = [{ eventType: 'click', timestamp: new Date('2023-06-01') }];
        Event.find.mockResolvedValue(mockEvents);

        await getEvents(req, res);

        expect(Event.find).toHaveBeenCalledWith({
            timestamp: { $gte: new Date('2023-01-01'), $lte: new Date('2023-12-31') },
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockEvents);
    });

    it('should return a 400 error if the startDate or endDate is invalid', async () => {
        req.query = { startDate: 'invalid-date', endDate: '2023-12-31' };

        await getEvents(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid date format' });
    });

    it('should return a 500 error if there is an internal server error', async () => {
        Event.find.mockRejectedValue(new Error('Database error'));

        await getEvents(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving events' });
    });
});
