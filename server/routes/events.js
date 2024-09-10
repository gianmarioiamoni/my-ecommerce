// /routes/events.js
import express from 'express';
import { getEvents, logEvent } from '../controllers/events.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Route to get all events between two dates
router.get('/', isAuthenticated, isAdmin, getEvents);

// Route to log an event
router.post('/', isAuthenticated, logEvent);


export default router;