// /routes/events.js
import express from 'express';
import { getEvents, logEvent } from '../controllers/events.js';

const router = express.Router();

// Route to get all events between two dates
router.get('/', getEvents);

// Route to log an event
router.post('/', logEvent);


export default router;