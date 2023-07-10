import express from "express";
const router = express.Router()
import Chat from '../controllers/chatController.js'
import { verifyUserJWT } from './auth.js'

router.post('/new-conversation', verifyUserJWT, Chat.newConversation)
router.get('/conversation/:id', verifyUserJWT, Chat.getConversation)
router.post('/new-message', verifyUserJWT, Chat.newMessage)
router.get('/message/:id', verifyUserJWT, Chat.getMessages)
router.get('/single-conversation/:senderId/:receiverId', verifyUserJWT, Chat.getSingleConversation)


export default router;