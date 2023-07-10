import express from 'express';
const router = express.Router();
import authenticationSchema from '../modules/authentication/authenticationSchema.js';
import manufacturerFormSchema from '../modules/manufacturer/manufacturerFormSchema.js';
import mongoose from 'mongoose'
import Jwt from 'jsonwebtoken'

export default {
    getTransporters: async (req, res) => {
        try {
            authenticationSchema.find({ userType: 'transporter' }).then((response) => {
                res.status(200).json(response)
            }).catch(console.error)
        } catch (error) {
            res.status(501).json({ message: error.message });
        }
    },
    getOrders: async (req, res) => {
        try {
            const decodedToken = Jwt.verify(req.headers.authorization, process.env.USER_JWT_SECRET);
            const userValue = decodedToken.user;
            const [email, name, userRole, userId] = userValue.split(' ');
            const getUser = await authenticationSchema.findOne({ email })

            const orders = await manufacturerFormSchema.find({ transporter: getUser._id })
                .populate('userID');
            res.status(200).json(orders)

        } catch (error) {
            res.status(501).json({ message: error.message });
        }
    },


}