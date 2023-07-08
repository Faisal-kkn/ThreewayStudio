import express from "express";
import manufacturer from '../controllers/manufacturerController.js';
const router = express.Router()
import { verifyUserJWT } from './auth.js'


router.post('/order', verifyUserJWT, manufacturer.order)
router.get('/getOrders', verifyUserJWT, manufacturer.getOrders)
router.post('/updateOrderStatus', verifyUserJWT, manufacturer.updateOrderStatus)


export default router;