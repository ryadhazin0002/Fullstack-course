import express from 'express';
import {router as dishRouter} from './dishRoute.js';

// Initialize express router
export const router = express.Router();

// Middleware to main route
router.use('/api', dishRouter);

