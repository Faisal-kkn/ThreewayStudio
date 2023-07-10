import express from "express";
const router = express.Router()
import common from '../controllers/commonController.js'
import { verifyUserJWT } from './auth.js'


router.get('/searchOrder', verifyUserJWT, common.searchOrder)
router.get('/user', verifyUserJWT, common.getUser)

export default router;