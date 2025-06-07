import express, { Router } from 'express';
const router = express.Router();

import { fetchLeetCode,fetchUserExist,AddLeetCodeAccount,
    fetchUserNameExists,deleteLeetCodeUser 
,fetchFromDB} from '../Controller/LeetCode.js';


router.get('/fetch/:username/',fetchLeetCode);
router.get('/check-username/:username',fetchUserExist);
router.post('/add-leetcode',AddLeetCodeAccount);

router.get('/fetch-user-name-exist/:leetid',fetchUserNameExists);
router.delete('/delete-leetcode/:leetid',deleteLeetCodeUser);

router.get('/fetch-from-db/:leetid',fetchFromDB);
// router.get('/fetch-leetcode',)
export default router;