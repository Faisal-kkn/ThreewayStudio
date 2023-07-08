import express from "express";
import authenticationController from '../controllers/authenticationController.js';
const router = express.Router()
import { verifyUserJWT } from './auth.js'


router.post('/register', authenticationController.register)
router.post('/login', authenticationController.login)
router.get('/isUserAuth', verifyUserJWT, authenticationController.verifyJWT)



export default router;