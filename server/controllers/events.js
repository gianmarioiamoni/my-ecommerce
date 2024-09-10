// /controllers/userBehaviorController.js
import Event from '../models/Event.js';

const getEvents = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        try {
            // verify that startDate and endDate are valid date strings
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ message: 'Invalid date format' });
            }

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

const logEvent = async (req, res) => {
    const { userId, eventType, productId, metadata } = req.body;
    console.log('logEvent called with:', { userId, eventType, productId, metadata });
    try {
        const newEvent = new Event({
            userId,
            eventType,
            productId,
            metadata,
        });

        const savedEvent = await newEvent.save();
        console.log('Event saved:', savedEvent);
        res.status(201).json(savedEvent);
    } catch (error) {
        console.error('Error in logEvent:', error);
        res.status(500).json({ message: 'Error in logEvent' });
    }
};

export { getEvents, logEvent };
