import express from "express";
import manufacturer from '../controllers/manufacturerController.js';
const router = express.Router()


router.get('/', manufacturer.register)



export default router;