import Event from '../models/Event.js';

/**
 * Get a list of events that occurred between the given start and end dates.
 * @param {object} req The request object
 * @param {object} res The response object
 */
const getEvents = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        try {
            // verify that startDate and endDate are valid date strings
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                // if the dates are invalid, return a 400 error
                return res.status(400).json({ message: 'Invalid date format' });
            }

            // query the database for events that occurred between the given dates
            const events = await Event.find({
                timestamp: { $gte: start, $lte: end }
            }).exec();

            res.status(200).json(events);
        } catch (error) {
            console.error('Error retrieving events:', error);
            res.status(500).json({ message: 'Error retrieving events' });
        }
    } catch (error) {
        console.error('Error retrieving events:', error);
        res.status(500).json({ message: 'Error retrieving events' });
    }
};

/**
 * Log a user event.
 * @param {object} req The request object
 * @param {object} res The response object
 */
const logEvent = async (req, res) => {
    const { userId, eventType, productId, metadata } = req.body;

    try {
        const newEvent = new Event({
            userId,
            eventType,
            productId,
            metadata,
        });

        // Save the event in the database
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        console.error('Error in logEvent:', error);
        res.status(500).json({ message: 'Error in logEvent' });
    }
};

export { getEvents, logEvent };
