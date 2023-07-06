import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

export default {
    register: async (req, res) => {
        try {

        } catch (error) {
            res.status(501).json({ message: error.message });
        }
    },


}