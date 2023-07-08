import express from 'express';
const router = express.Router();
import authenticationSchema from '../modules/authentication/authenticationSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
export default {
    verifyJWT: async (req, res, next) => {
        res.status(200).json({ auth: true, message: "You are authenticated Congrats!" })
    },
    register: async (req, res) => {
        try {
            const { username, email, password, userType, address } = req.body
            let Email = await authenticationSchema.findOne({ email: email.toLowerCase() })
            if (Email) {
                res.status(200).json({ status: false, msg: 'This mail id is already used' })
            } else {
                const userPassword = await bcrypt.hash(password, 10)
                let registerUser = new authenticationSchema({ username, email, password: userPassword, userType, address })
                registerUser.save().then((response) => {
                    res.status(200).json(response)
                }).catch(console.error);
            }

        } catch (error) {
            res.status(501).json({ message: error.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body

            let userData = await authenticationSchema.findOne({ email })
            if (userData) {
                let passwordCheck = await bcrypt.compare(password, userData.password)
                if (passwordCheck) {
                    const user = userData.email + ' ' + userData.username + ' ' + userData.userType
                    let token = jwt.sign({ user }, process.env.USER_JWT_SECRET, { expiresIn: 30000 });
                    res.status(200).json({ status: true, auth: true, token })
                } else res.json({ status: false, msg: 'Password is incorrect' })
            } else res.json({ status: false, msg: 'Mail id is not found' })
        } catch (error) {
            res.status(501).json({ message: error.message });
        }
    },

}