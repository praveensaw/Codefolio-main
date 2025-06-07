import express from 'express';
const router = express.Router();

import {addGitHubBasics,updateGitHubAdvanced,deleteGithubUser,fetchFromDB,updateGitHubData} from '../Controller/GitHub.js';

router.post('/add-github-basics',addGitHubBasics);
router.post('/add-github-advanced',updateGitHubAdvanced);
router.delete('/delete-github/:geetid',deleteGithubUser);

router.get('/fetch-git-from-db/:geetid',fetchFromDB);
router.get('/fetch-git/:username',updateGitHubData);
export default router;