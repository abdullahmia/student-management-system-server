const jsonwebtoken = require("jsonwebtoken");
const { createResponse } = require("../utils/responseGenarate");
const { User } = require("../models/user");

module.exports.isLoggedIn = async (req, res, next) => {
    let token = req.header("Authorization");
    if (!token) {
        return res.status(401).json(createResponse(null, "Access Denied"));
    } else {
        try {
            token = token.split(" ")[1].trim();
            // decode the jwt
            const decoded = await jsonwebtoken.verify(
                token,
                process.env.JWT_SECRET
            );
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(400).send("Invalid Token!");
        }
    }
};

// is admin middleware
module.exports.isAdmin = async (req, res, next) => {
    let user = req.user;
    let { _id, role } = user;
    let dbUser = await User.findOne({ _id });
    if (role === dbUser.role) {
        next();
    } else {
        return res
            .status(403)
            .json(createResponse(null, "Access Denied", true));
    }
};
