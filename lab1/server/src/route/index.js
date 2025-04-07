import express from 'express';
import {router as dishRouter} from './dishRoute.js';

export const router = express.Router();


router.use('/api', dishRouter);

