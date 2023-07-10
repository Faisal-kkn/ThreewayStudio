
import conversationSchema from '../modules/chat/conversationSchema.js';
import messageSchema from '../modules/chat/messageSchema.js';
import Jwt from 'jsonwebtoken'

export default {
    newConversation: async (req, res) => {
        try {
            const { senderId, receiverId } = req.body;

            const conversationCheck = await conversationSchema.findOne({ members: { $all: [senderId, receiverId] } })

            if (conversationCheck == null) {
                const newConversation = new conversationSchema({
                    members: [senderId, receiverId],
                })

                const savedConversation = await newConversation.save()
                res.status(200).json(savedConversation)
            } else {
                res.status(200).json(true)
            }
        } catch (error) {
            res.status(501).json({ message: error.message });
        }
    },
    getConversation: async (req, res) => {
        try {
            const conversation = await conversationSchema.find({
                members: { $in: [req.params.id] },
            })
            res.status(200).json(conversation)

        } catch (error) {
            res.status(501).json({ message: error.message });
        }
    },
    getSingleConversation: async (req, res) => {
        try {
            const conversation = await conversationSchema.findOne({ members: { $all: [req.params.senderId, req.params.receiverId] } })
            res.status(200).json(conversation)
        } catch (error) {
            res.status(501).json({ message: error.message });
        }
    },
    newMessage: async (req, res) => {
        try {

            const newMessage = new messageSchema(req.body)
            const savedMessage = await newMessage.save()
            res.status(200).json(savedMessage)

        } catch (error) {
            res.status(501).json({ message: error.message });
        }
    },
    getMessages: async (req, res) => {
        try {
            const messages = await messageSchema.find({
                conversationId: req.params.id
            })
            res.status(200).json(messages)

        } catch (error) {
            res.status(501).json({ message: error.message });
        }
    },
}
