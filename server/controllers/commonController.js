
import manufacturerFormSchema from '../modules/manufacturer/manufacturerFormSchema.js';
import authenticationSchema from '../modules/authentication/authenticationSchema.js';
import Jwt from 'jsonwebtoken'

export default {
    searchOrder: async (req, res) => {
        try {
            const decodedToken = Jwt.verify(req.headers.authorization, process.env.USER_JWT_SECRET);
            const userValue = decodedToken.user;
            const [email, name, userRole, userId] = userValue.split(' ');
            const getUser = await authenticationSchema.findOne({ email })
            let conditions;
            if (getUser?.userType === "manufacturer") {
                conditions = {
                    userID: getUser._id
                }
            } else if (getUser?.userType === "transporter") {
                conditions = {
                    transporter: getUser._id
                }
            }
            const searchResult = await manufacturerFormSchema.find({
                $or: [
                    { OrderID: { $regex: new RegExp(req.query.search, 'i') } },
                    { to: { $regex: new RegExp(req.query.search, 'i') } },
                    { from: { $regex: new RegExp(req.query.search, 'i') } }
                ],
                ...conditions
            });
            res.status(200).json(searchResult)
        } catch (error) {
            res.status(501).json({ message: error.message });
        }
    },
    getUser: async (req, res) => {
        try {
            const result = await authenticationSchema.findOne({ _id: req.query.userId })
            res.status(200).json(result)
        } catch (error) {
            res.status(501).json({ message: error.message });
        }
    },
}