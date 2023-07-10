import express from 'express';
const router = express.Router();
import Jwt from 'jsonwebtoken'

import manufacturerFormSchema from '../modules/manufacturer/manufacturerFormSchema.js';
import authenticationSchema from '../modules/authentication/authenticationSchema.js';
import mongoose from 'mongoose'

export default {
    order: async (req, res) => {
        try {
            const { from, to, quantity, transporter } = req.body
            const decodedToken = Jwt.verify(req.headers.authorization, process.env.USER_JWT_SECRET);
            const userValue = decodedToken.user;
            const [email, name, userRole, userId] = userValue.split(' ');
            const getUser = await authenticationSchema.findOne({ email })

            let orderRequest = new manufacturerFormSchema({
                from,
                to,
                quantity,
                pickupAddress: getUser.address,
                transporter,
                status: "REQUESTED",
                userID: getUser._id,
            })

            orderRequest.save().then((response) => {
                res.status(200).json(response)
            }).catch(console.error);
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

            const orders = await manufacturerFormSchema.find({ userID: getUser._id })
                .populate('transporter');
            res.status(200).json(orders)

        } catch (error) {
            res.status(501).json({ message: error.message });
        }
    },
    updateOrderStatus: async (req, res) => {
        try {
            const { status, Id, price } = req.body
            manufacturerFormSchema.updateOne({ _id: Id }, {
                $set: {
                    status,
                    price
                }
            }).then((response) => {
                res.status(200).json(response)
            }).catch(console.error);
        } catch (error) {
            res.status(501).json({ message: error.message });
        }
    },



}