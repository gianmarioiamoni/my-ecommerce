// /controllers/userBehaviorController.js
import Event from '../models/Event.js';

const getEvents = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Filtra gli eventi tra le date specificate
        const query = {
            timestamp: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        };

        const events = await Event.find(query).sort({ timestamp: -1 });

        res.status(200).json(events);
    } catch (error) {
        console.error('Error retrieving events:', error);
        res.status(500).json({ message: 'Error retrieving events' });
    }
};

const logEvent = async (req, res) => {
    const { userId, eventType, productId, metadata } = req.body;
    try {
        const newEvent = new Event({
            userId,
            eventType,
            productId,
            metadata,
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        console.error('Error in logEvent:', error);
        res.status(500).json({ message: 'Error in logEvent' });
    }
};

export { getEvents, logEvent };
