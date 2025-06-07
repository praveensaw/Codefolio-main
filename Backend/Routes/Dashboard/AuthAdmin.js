import express from 'express';
const router = express.Router();

import {
    registerAdmin, verifyAndRegisterAdmin, checkTokenValidity
    , LoginAdmin, getAdmins, changeAdminStatus
} from '../../Controller/Dashboard/AuthAdmin.js';

router.post('/register-verify', registerAdmin)
router.post('/final-register', verifyAndRegisterAdmin)
router.get('/check-token', checkTokenValidity)
router.post('/login-admin', LoginAdmin)
router.get('/get-admins', getAdmins)
router.get('/change-admin/status/:id', changeAdminStatus)

export default router;