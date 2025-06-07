import express from 'express';
const router = express.Router();

import { addGFG,fetchGFG, deleteGeekforGeeksUser,fetchGFGfromDB} from '../Controller/GeeksForGeeks.js';
router.post('/add-gfg',addGFG)
router.get('/fetch-gfg/:username',fetchGFG)
router.get('/fetch-gfg-db/:gfgid',fetchGFGfromDB)
router.delete('/delete-geeksforgeeks/:geekid',deleteGeekforGeeksUser);

export default router;