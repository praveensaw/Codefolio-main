import express from 'express';
const router = express.Router();

import { sendOTPEmail,sendSignUpSuccessfulEmail } from '../Controller/EmailService.js';

import { Signup,Login,checkUsername,getUser,checkUser,getUserbyId ,
    editUserbyId,verifyPassword,getAllStat} from '../Controller/AuthUser.js';

router.post('/user/sign-up',Signup)
router.post('/user/login',Login)
router.get('/user/check-username/:username',checkUsername)
router.get('/user/getuser/:id',getUserbyId)
router.put('/user/edituser/:id',editUserbyId)
router.post('/user/verify-pass',verifyPassword);
router.get('/user/stat',getAllStat)

router.get('/user/get-user/:id',getUser)
router.get('/user/check-user/:username',checkUser)

router.post('/user/email/email-signup',sendSignUpSuccessfulEmail)
router.post('/user/email/email-otp',sendOTPEmail)

// import { fetchGFG } from '../Controller/GeeksForGeeks.js';
// router.post('/fetch/gfg',fetchGFG)
import {updateUserProfile } from '../Controller/useredit.js'
import { authMiddleware } from '../Middleware/authMiddleware.js';
router.put('/user/edit-profile',updateUserProfile);


import {checkUserProfile,refreshWholeProfile} from '../Controller/UserGrowth.js';
router.get('/user/check-user-profile/:username',checkUserProfile)
router.get('/user/refresh-user-profile/:username',refreshWholeProfile)


import {submitContactForm} from '../Controller/AuthUser.js'
// import Contactus from '../Models/Contactus.js';
router.post("/contact", submitContactForm);  // Submit form


export default router;