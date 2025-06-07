import express from 'express';
const router = express.Router();

import {getAllUsers} from '../../Controller/Dashboard/AllCoders.js';

router.get('/get-all',getAllUsers)


export default router;