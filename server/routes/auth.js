import Jwt from 'jsonwebtoken'

export const verifyUserJWT = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        res.json({ auth: false, message: "We need a token, please give it to us next time" });
    } else {
        Jwt.verify(token, process.env.USER_JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
                res.json({ auth: false, message: "You have failed to authenticate" });
            } else {
                next();
            }
        });
    }
};
