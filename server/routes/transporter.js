import express from "express";
import transporter from '../controllers/transporterController.js';
const router = express.Router()
import { verifyUserJWT } from './auth.js'

router.get('/getTransporters', verifyUserJWT, transporter.getTransporters)
router.get('/getOrders', verifyUserJWT, transporter.getOrders)


export default router;