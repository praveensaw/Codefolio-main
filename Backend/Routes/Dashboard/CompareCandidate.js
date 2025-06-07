import express from 'express';
const router = express.Router();

import { searchCandidates,compareTwoCandidates } from '../../Controller/Dashboard/CompareCandidates.js';

router.get('/search/candidates', searchCandidates);
router.post('/compare/two', compareTwoCandidates);


export default router;