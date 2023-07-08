
import manufacturerFormSchema from '../modules/manufacturer/manufacturerFormSchema.js';
import authenticationSchema from '../modules/authentication/authenticationSchema.js';
import Jwt from 'jsonwebtoken'

export default {
    searchOrder: async (req, res) => {
        try {
            const decodedToken = Jwt.verify(req.headers.authorization, process.env.USER_JWT_SECRET);
            const userValue = decodedToken.user;
            const [email, name] = userValue.split(' ');
            const getUser = await authenticationSchema.findOne({ email })
            let conditions;
            console.log({ getUser });
            if (getUser?.userType === "manufacturer") {
                console.log('1');
                conditions = {
                    userID: getUser._id
                }
            } else if (getUser?.userType === "transporter") {
                console.log('2');
                conditions = {
                    transporter: getUser._id
                }
            }
            console.log({ conditions });
            const searchResult = await manufacturerFormSchema.find({
                $or: [
                    { OrderID: { $regex: new RegExp(req.query.search, 'i') } },
                    { to: { $regex: new RegExp(req.query.search, 'i') } },
                    { from: { $regex: new RegExp(req.query.search, 'i') } }
                ],
                ...conditions
            });
            console.log({ searchResult });
            res.status(200).json(searchResult)
        } catch (error) {
            res.status(501).json({ message: error.message });
        }
    }
}