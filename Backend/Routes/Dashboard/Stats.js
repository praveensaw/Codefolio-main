import express from 'express';
const router = express.Router();

import {getDashboardStats} from '../../Controller/Dashboard/Stats.js';
router.get('/getstats',getDashboardStats)

export default router;