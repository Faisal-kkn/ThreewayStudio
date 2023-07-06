import express from 'express';
const router = express.Router();
import authentication from '../modules/authentication/authenticationSchema.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

export default {
    register: async (req, res) => {
        try {
            const { email } = req.body
            let Email = await authentication.findOne({ email: email.toLowerCase() })
            if (Email) {
                console.log({ Email });
                // res.status(200).json({ signup: false, msg: 'This user name is already taken', username: false })
            } else {
                console.log('user not exist');
                // let mailId = await userRegisterSchema.findOne({ email: req.body.email })
            }

        } catch (error) {
            res.status(501).json({ message: error.message });
        }
    },


}