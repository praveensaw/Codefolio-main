import express from 'express';
const router = express.Router();

import {AddCodeForcesAccount,UpdateCodeForcesAccount,deleteCodeForcesUser,fetchCodeforcesContestData,fetchCodeforcesAccount,fetchCodeforcesFromDB, getLatestContest} from '../Controller/CodeForces.js';
router.get('/fetch/:username',UpdateCodeForcesAccount)
router.get('/contestfetch',getLatestContest)
router.post("/add-codeforces", AddCodeForcesAccount);
// router.get("/fetch-multiple-codeforces-users", fetchMultipleCodeforcesUsers);
router.get("/contests", fetchCodeforcesContestData);
// router.post("/fetch", fetchCodeForces);

router.delete('/delete-codeforces/:codeforcesid',deleteCodeForcesUser);
router.get('/fetch-codeforces/:username',fetchCodeforcesAccount)

router.get('/fetch-codeforces-from-db/:codeforcesid', fetchCodeforcesFromDB);

export default router;